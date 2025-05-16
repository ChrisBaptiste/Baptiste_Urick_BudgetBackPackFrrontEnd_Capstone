// src/pages/EditTripPage.jsx 
// (e.g., ClientSide-Server/src/pages/EditTrip/EditTripPage.jsx or ClientSide-Server/src/pages/EditTripPage.jsx)

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './EditTripPage.css'; // I'm making sure to import its dedicated CSS file.

const EditTripPage = () => {
  const { tripId } = useParams(); 
  
  const [formData, setFormData] = useState({
    tripName: '',
    destinationCity: '',
    destinationCountry: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false); 
  const [pageLoading, setPageLoading] = useState(true); 
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!tripId) {
        setError("No trip ID provided for editing.");
        setPageLoading(false);
        return;
    }
    
    setPageLoading(true);
    axios.get(`/api/trips/${tripId}`)
      .then(response => {
        const tripData = response.data;
        setFormData({
          tripName: tripData.tripName || '',
          destinationCity: tripData.destinationCity || '',
          destinationCountry: tripData.destinationCountry || '',
          startDate: tripData.startDate ? new Date(tripData.startDate).toISOString().split('T')[0] : '',
          endDate: tripData.endDate ? new Date(tripData.endDate).toISOString().split('T')[0] : '',
          notes: tripData.notes || '',
        });
        setPageLoading(false);
      })
      .catch(err => {
        console.error("Error fetching trip data for edit:", err);
        setError('Failed to load trip data. The trip may not exist or you might not have permission.');
        setPageLoading(false);
      });
  }, [tripId]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      setFieldErrors({ endDate: 'End date cannot be before start date.' });
      setLoading(false);
      return;
    }

    try {
      await axios.put(`/api/trips/${tripId}`, formData);
      console.log('Trip updated successfully'); // My debug message.
      setLoading(false);
      navigate(`/trip/${tripId}`); // Redirecting to the details page of the trip I just edited.

    } catch (err) {
      setLoading(false);
      console.error("Error updating trip:", err.response); // My debug message.
      
      if (err.response && err.response.data) {
        const resData = err.response.data;
        if (resData.errors && Array.isArray(resData.errors)) {
          let newFieldErrors = {};
          let generalErrorAccumulator = '';
          resData.errors.forEach(er => { // Assuming er is { msg: "..." } from my backend
            const msgContent = er.msg;
            const lowerMsg = msgContent.toLowerCase();
            if (lowerMsg.includes('trip name')) newFieldErrors.tripName = msgContent;
            else if (lowerMsg.includes('city')) newFieldErrors.destinationCity = msgContent;
            else if (lowerMsg.includes('country')) newFieldErrors.destinationCountry = msgContent;
            else if (lowerMsg.includes('start date')) newFieldErrors.startDate = msgContent;
            else if (lowerMsg.includes('end date')) newFieldErrors.endDate = msgContent;
            else generalErrorAccumulator += (generalErrorAccumulator ? '; ' : '') + msgContent;
          });
          setFieldErrors(newFieldErrors);
          if(generalErrorAccumulator) setError(generalErrorAccumulator);
        } else if (resData.msg) {
          setError(resData.msg);
        } else {
          setError('Failed to update trip. An unknown error occurred.');
        }
      } else {
        setError('Failed to update trip. Please check your connection.');
      }
    }
  };

  if (pageLoading) {
    return <div className="container text-center"><p>Loading trip information...</p></div>;
  }

  if (error && !formData.tripName) { 
    return (
        <div className="container text-center error-message"> 
            <p>{error}</p>
            <Link to="/dashboard">Back to Dashboard</Link>
        </div>
    );
  }

  return (
    // I'm using "edit-trip-container" as the main class for this page, styled in EditTripPage.css
    // and "container" for global padding/max-width.
    <div className="edit-trip-container container"> 
      <h2>Edit Your Trip</h2>
      <p>Update the details of your trip below.</p>

      {/* I can reuse "trip-form" class if the styling is identical to the create form,
          or define specific styles in EditTripPage.css */}
      <form onSubmit={handleSubmit} className="trip-form"> 
        {/* Displaying general error only if there are no specific field errors for cleaner UI */}
        {error && !Object.keys(fieldErrors).length > 0 && 
          <p className="form-error-message general-error" style={{textAlign: 'center'}}>{error}</p>}

        {/* --- Form Groups --- */}
        {/* Username, Email, Password, Confirm Password fields remain the same structure */}
        {/* Example for Trip Name: */}
        <div className="form-group">
          <label htmlFor="tripName">Trip Name</label>
          <input type="text" id="tripName" name="tripName" value={formData.tripName} onChange={handleChange} required aria-invalid={!!fieldErrors.tripName} aria-describedby={fieldErrors.tripName ? "tripName-error" : undefined} />
          {fieldErrors.tripName && <p id="tripName-error" className="form-error-message">{fieldErrors.tripName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="destinationCity">Destination City</label>
          <input type="text" id="destinationCity" name="destinationCity" value={formData.destinationCity} onChange={handleChange} required aria-invalid={!!fieldErrors.destinationCity} aria-describedby={fieldErrors.destinationCity ? "destinationCity-error" : undefined} />
          {fieldErrors.destinationCity && <p id="destinationCity-error" className="form-error-message">{fieldErrors.destinationCity}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="destinationCountry">Destination Country</label>
          <input type="text" id="destinationCountry" name="destinationCountry" value={formData.destinationCountry} onChange={handleChange} required aria-invalid={!!fieldErrors.destinationCountry} aria-describedby={fieldErrors.destinationCountry ? "destinationCountry-error" : undefined} />
          {fieldErrors.destinationCountry && <p id="destinationCountry-error" className="form-error-message">{fieldErrors.destinationCountry}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required aria-invalid={!!fieldErrors.startDate} aria-describedby={fieldErrors.startDate ? "startDate-error" : undefined} />
          {fieldErrors.startDate && <p id="startDate-error" className="form-error-message">{fieldErrors.startDate}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required aria-invalid={!!fieldErrors.endDate} aria-describedby={fieldErrors.endDate ? "endDate-error" : undefined} />
          {fieldErrors.endDate && <p id="endDate-error" className="form-error-message">{fieldErrors.endDate}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="4"></textarea>
        </div>
        {/* --- End of Form Groups --- */}

        <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}} disabled={loading || pageLoading}>
          {loading ? 'Updating...' : 'Update Trip'}
        </button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to={`/trip/${tripId}`} className="btn btn-link"> {/* My cancel link goes back to the specific trip's details. */}
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default EditTripPage;