import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";

const Mypersonaldetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fullName: "",
    emailId: "",
    personalEmailId: "",
    employeeNumber: "",
    gender: "",
    mobileNumber: "",
    emergencyNumber: "",
    aadharNumber: "",
    socialSecurityNumber: "",
    panNumber: "",
    dateOfBirth: "",
    nationality: "",
    maritalStatus: "",
    currentResidentialAddress: "",
    permanentResidentialAddress: "",
    jobTitle: "",
    employmentStartDate: "",
    employmentLocation: "",
    visaType: "",
    visaEndDate: "",
    supervisor: "",
    hr: ""
  });

  const API_BASE_URL = "http://localhost:5000/api/personal-details";

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const resetForm = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const nameParts = (storedUser?.name || storedUser?.username || "").split(" ");

    setFormData({
      firstName: nameParts[0] || "",
      middleName: "",
      lastName: nameParts.slice(1).join(" ") || "",
      fullName: storedUser?.name || storedUser?.username || "",
      emailId: storedUser?.email || "",
      personalEmailId: "",
      employeeNumber: "",
      gender: "",
      mobileNumber: "",
      emergencyNumber: "",
      aadharNumber: "",
      socialSecurityNumber: "",
      panNumber: "",
      dateOfBirth: getTodayDate(),
      nationality: "",
      maritalStatus: "",
      currentResidentialAddress: "",
      permanentResidentialAddress: "",
      jobTitle: storedUser?.jobTitle || "",
      employmentStartDate: storedUser?.employmentStartDate || "",
      employmentLocation: storedUser?.employmentLocation || "",
      visaType: "",
      visaEndDate: "",
      supervisor: storedUser?.supervisor || "",
      hr: storedUser?.hr || ""
    });
  };

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      setFetching(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        resetForm();
        setFetching(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}?email=${storedUser.email}`);

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const formattedDate = result.data.dateOfBirth
              ? new Date(result.data.dateOfBirth).toISOString().split('T')[0]
              : getTodayDate();

            const formattedVisaEndDate = result.data.visaEndDate
              ? new Date(result.data.visaEndDate).toISOString().split('T')[0]
              : "";

            const formattedEmploymentStartDate = result.data.employmentStartDate
              ? new Date(result.data.employmentStartDate).toISOString().split('T')[0]
              : storedUser?.employmentStartDate || "";

            setFormData({
              firstName: result.data.firstName || "",
              middleName: result.data.middleName || "",
              lastName: result.data.lastName || "",
              fullName: result.data.fullName || "",
              emailId: result.data.emailId || storedUser.email || "",
              personalEmailId: result.data.personalEmailId || "",
              employeeNumber: result.data.employeeNumber || "",
              gender: result.data.gender || "",
              mobileNumber: result.data.mobileNumber || "",
              emergencyNumber: result.data.emergencyNumber || "",
              aadharNumber: result.data.aadharNumber || "",
              socialSecurityNumber: result.data.socialSecurityNumber || "",
              panNumber: result.data.panNumber || "",
              dateOfBirth: formattedDate,
              nationality: result.data.nationality || "",
              maritalStatus: result.data.maritalStatus || "",
              currentResidentialAddress: result.data.currentResidentialAddress || "",
              permanentResidentialAddress: result.data.permanentResidentialAddress || "",
              jobTitle: result.data.jobTitle || storedUser?.jobTitle || "",
              employmentStartDate: formattedEmploymentStartDate,
              employmentLocation: result.data.employmentLocation || storedUser?.employmentLocation || "",
              visaType: result.data.visaType || "",
              visaEndDate: formattedVisaEndDate,
              supervisor: result.data.supervisor || storedUser?.supervisor || "",
              hr: result.data.hr || storedUser?.hr || ""
            });
          }
        } else if (response.status === 404) {
          resetForm();
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
        resetForm();
      } finally {
        setFetching(false);
      }
    };

    fetchPersonalDetails();
  }, []);

  useEffect(() => {
    const fullName = [formData.firstName, formData.middleName, formData.lastName]
      .filter(name => name && name.trim())
      .join(" ");

    setFormData(prev => ({ ...prev, fullName }));
  }, [formData.firstName, formData.middleName, formData.lastName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const submitData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        emailId: formData.emailId,
        personalEmailId: formData.personalEmailId,
        gender: formData.gender,
        mobileNumber: formData.mobileNumber,
        emergencyNumber: formData.emergencyNumber,
        aadharNumber: formData.aadharNumber,
        socialSecurityNumber: formData.socialSecurityNumber,
        panNumber: formData.panNumber,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        maritalStatus: formData.maritalStatus,
        currentResidentialAddress: formData.currentResidentialAddress,
        permanentResidentialAddress: formData.permanentResidentialAddress,
        visaType: formData.visaType,
        visaEndDate: formData.visaEndDate
      };

      let response;

      if (formData.employeeNumber) {
        response = await fetch(`${API_BASE_URL}/${formData.employeeNumber}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData)
        });
      } else {
        response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData)
        });
      }

      const result = await response.json();

      if (result.success) {
        setShowSuccess(true);

        if (result.data?.employeeNumber) {
          const updatedUser = { ...storedUser, employeeNumber: result.data.employeeNumber };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        setTimeout(() => {
          resetForm();
          setShowSuccess(false);
        }, 2000);
      } else {
        alert(result.message || "Failed to save personal details");
      }
    } catch (error) {
      console.error("Error saving personal details:", error);
      alert("Error saving personal details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading personal details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>Saved successfully! Form is clearing...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-blue-900 text-white px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm hidden sm:inline">Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">My Personal Details</h1>
            <p className="text-blue-200 text-sm">View and manage your personal information</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Section: Name & Identity ── */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Name &amp; Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="firstName" value={formData.firstName}
                  onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter first name"
                />
              </div>

              {/* Middle Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  type="text" name="middleName" value={formData.middleName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter middle name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="lastName" value={formData.lastName}
                  onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter last name"
                />
              </div>

              {/* Full Name (auto) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name (as in official records)
                </label>
                <input
                  type="text" name="fullName" value={formData.fullName} readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender" value={formData.gender} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date" name="dateOfBirth" value={formData.dateOfBirth}
                  onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-blue-600 mt-1">📅 Default: Today's date ({getTodayDate()})</p>
              </div>

              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select
                  name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <select
                  name="nationality" value={formData.nationality} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Nationality</option>
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                  <option value="British">British</option>
                  <option value="Canadian">Canadian</option>
                  <option value="Australian">Australian</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Section: Contact Information ── */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Work Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email" name="emailId" value={formData.emailId}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Personal Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Email ID</label>
                <input
                  type="email" name="personalEmailId" value={formData.personalEmailId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter personal email"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel" name="mobileNumber" value={formData.mobileNumber}
                  onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter mobile number"
                />
              </div>

              {/* Emergency Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Number</label>
                <input
                  type="tel" name="emergencyNumber" value={formData.emergencyNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter emergency contact number"
                />
              </div>

              {/* Current Residential Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Residential Address
                </label>
                <textarea
                  name="currentResidentialAddress"
                  value={formData.currentResidentialAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Enter current residential address"
                />
              </div>

              {/* Permanent Residential Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permanent Residential Address
                </label>
                <textarea
                  name="permanentResidentialAddress"
                  value={formData.permanentResidentialAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Enter permanent residential address"
                />
              </div>
            </div>
          </div>

          {/* ── Section: Government IDs ── */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Government IDs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar Number (India)
                </label>
                <input
                  type="text" name="aadharNumber" value={formData.aadharNumber}
                  onChange={handleChange} maxLength="12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter 12-digit Aadhar number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Social Security Number (USA)
                </label>
                <input
                  type="text" name="socialSecurityNumber" value={formData.socialSecurityNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter SSN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                <input
                  type="text" name="panNumber" value={formData.panNumber}
                  onChange={handleChange} maxLength="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter PAN number"
                />
              </div>

              {/* Employee Number (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Number</label>
                <input
                  type="text" name="employeeNumber" value={formData.employeeNumber} readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* ── Section: Employment Details ── */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Employment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Job Title (auto-pick) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text" name="jobTitle" value={formData.jobTitle} readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                  placeholder="Auto-populated from system"
                />
              </div>

              {/* Employment Start Date (auto-pick) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Start Date</label>
                <input
                  type="text" name="employmentStartDate" value={formData.employmentStartDate} readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                  placeholder="Auto-populated from system"
                />
              </div>

              {/* Employment Location (auto-pick) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Location</label>
                <input
                  type="text" name="employmentLocation" value={formData.employmentLocation} readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                  placeholder="Auto-populated from system"
                />
              </div>

              {/* Supervisor (auto-pick) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                <input
                  type="text" name="supervisor" value={formData.supervisor} readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                  placeholder="Auto-populated from system"
                />
              </div>

              {/* HR (auto-pick) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HR</label>
                <input
                  type="text" name="hr" value={formData.hr} readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                  placeholder="Auto-populated from system"
                />
              </div>

              {/* Visa Type (dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type</label>
                <select
                  name="visaType" value={formData.visaType} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Visa Type</option>
                  <option value="H-1B">H-1B</option>
                  <option value="L-1">L-1</option>
                  <option value="F-1 OPT">F-1 OPT</option>
                  <option value="O-1">O-1</option>
                  <option value="TN">TN</option>
                  <option value="Work Permit">Work Permit</option>
                  <option value="Permanent Resident">Permanent Resident</option>
                  <option value="Citizen">Citizen / No Visa Required</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Visa End Date (calendar) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visa End Date</label>
                <input
                  type="date" name="visaEndDate" value={formData.visaEndDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button" onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Details
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Mypersonaldetails;