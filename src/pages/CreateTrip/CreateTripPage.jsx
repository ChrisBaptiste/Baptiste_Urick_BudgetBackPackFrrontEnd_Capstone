// src/pages/CreateTripPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateTripPage.css';
// I might want some specific CSS for this page later.


const CreateTripPage = () => {
  // I need state to manage all the form fields for creating a trip.
  const [formData, setFormData] = useState({
    tripName: '',
    destinationCity: '',
    destinationCountry: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false); // For loading state during API call.
  const [error, setError] = useState(''); // For displaying any errors from the API.
  const [fieldErrors, setFieldErrors] = useState({}); // For specific field validation errors (if backend provides them).

  const navigate = useNavigate(); // For redirecting after successful trip creation.

  // This function will handle changes in my form inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    // Clear specific field error if user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
    // Clear general error
    if (error) setError('');
  };

  // This function will handle the submission of the new trip form.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing default browser submission.
    setError('');
    setFieldErrors({});
    setLoading(true);

    // Basic client-side validation for dates (optional, backend should also validate)
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      setFieldErrors({ endDate: 'End date cannot be before start date.' });
      setLoading(false);
      return;
    }

    try {
      // My API endpoint for creating a new trip is a POST request to '/api/trips'.
      // The token is already included in axios defaults by my AuthContext.
      const response = await axios.post('/api/trips', formData);
      
      console.log('Trip created successfully:', response.data); // For my debugging.
      setLoading(false);

      // After successfully creating the trip, I'll redirect the user.
      // Redirecting to the dashboard seems like a good default.
      // Or, I could redirect to the new trip's detail page: navigate(`/trip/${response.data._id}`);
      navigate('/dashboard'); 

    } catch (err) {
      setLoading(false);
      console.error("Error creating trip:", err.response); // Logging the full error response.
      
      if (err.response && err.response.data) {
        const resData = err.response.data;
        if (resData.errors && Array.isArray(resData.errors)) {
          // If my backend sends an array of { field, msg } or just { msg }
          let newFieldErrors = {};
          let generalErrorAccumulator = '';
          resData.errors.forEach(e => {
            if (e.field && formData.hasOwnProperty(e.field)) { // Check if error has a field and if it's a known form field
              newFieldErrors[e.field] = e.msg;
            } else if (e.msg) { // Otherwise, treat as general error
                // This logic for field mapping from backend needs to match how backend sends errors
                
                const msgContent = e.msg.toLowerCase();
                if (msgContent.includes('trip name')) newFieldErrors.tripName = e.msg;
                else if (msgContent.includes('city')) newFieldErrors.destinationCity = e.msg;
                else if (msgContent.includes('country')) newFieldErrors.destinationCountry = e.msg;
                else if (msgContent.includes('start date')) newFieldErrors.startDate = e.msg;
                else if (msgContent.includes('end date')) newFieldErrors.endDate = e.msg;
                else generalErrorAccumulator += (generalErrorAccumulator ? '; ' : '') + e.msg;
            }
          });
          setFieldErrors(newFieldErrors);
          if(generalErrorAccumulator) setError(generalErrorAccumulator);

        } else if (resData.msg) { // Single error message
          setError(resData.msg);
        } else {
          setError('Failed to create trip. An unknown error occurred.');
        }
      } else {
        setError('Failed to create trip. Please check your connection.');
      }
    }
  };

  return (
    <div className="create-trip-container container"> {/* Using global .container for consistent padding/width */}
      <h2>Plan Your Next Adventure</h2>
      <p>Fill in the details below to create a new trip.</p>

      <form onSubmit={handleSubmit} className="trip-form">
        {error && <p className="form-error-message general-error" style={{textAlign: 'center'}}>{error}</p>}

        <div className="form-group">
          <label htmlFor="tripName">Trip Name</label>
          <input
            type="text"
            id="tripName"
            name="tripName"
            value={formData.tripName}
            onChange={handleChange}
            required
            aria-invalid={!!fieldErrors.tripName}
            aria-describedby={fieldErrors.tripName ? "tripName-error" : undefined}
          />
          {fieldErrors.tripName && <p id="tripName-error" className="form-error-message">{fieldErrors.tripName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="destinationCity">Destination City</label>
          <input
            type="text"
            id="destinationCity"
            name="destinationCity"
            value={formData.destinationCity}
            onChange={handleChange}
            required
            aria-invalid={!!fieldErrors.destinationCity}
            aria-describedby={fieldErrors.destinationCity ? "destinationCity-error" : undefined}
          />
          {fieldErrors.destinationCity && <p id="destinationCity-error" className="form-error-message">{fieldErrors.destinationCity}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="destinationCountry">Destination Country</label>
          <input
            type="text"
            id="destinationCountry"
            name="destinationCountry"
            value={formData.destinationCountry}
            onChange={handleChange}
            required
            aria-invalid={!!fieldErrors.destinationCountry}
            aria-describedby={fieldErrors.destinationCountry ? "destinationCountry-error" : undefined}
          />
          {fieldErrors.destinationCountry && <p id="destinationCountry-error" className="form-error-message">{fieldErrors.destinationCountry}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            aria-invalid={!!fieldErrors.startDate}
            aria-describedby={fieldErrors.startDate ? "startDate-error" : undefined}
          />
          {fieldErrors.startDate && <p id="startDate-error" className="form-error-message">{fieldErrors.startDate}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            aria-invalid={!!fieldErrors.endDate}
            aria-describedby={fieldErrors.endDate ? "endDate-error" : undefined}
          />
          {fieldErrors.endDate && <p id="endDate-error" className="form-error-message">{fieldErrors.endDate}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          ></textarea>
          {/* No specific error display for notes unless backend sends one */}
        </div>

        <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}} disabled={loading}>
          {loading ? 'Creating Trip...' : 'Create Trip'}
        </button>
      </form>
    </div>
  );
};

export default CreateTripPage;