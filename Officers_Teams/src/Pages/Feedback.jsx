import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faFile,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";

function Feedback() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const ITEMS_PER_PAGE = 25;

  useEffect(() => {
    fetchHelpRequests();
  }, [currentPage]);

  const fetchHelpRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/help/requests", {
        withCredentials: true,
      });

      // Calculate pagination
      const allRequests = response.data;
      const total = Math.ceil(allRequests.length / ITEMS_PER_PAGE);
      setTotalPages(total);

      // Get current page data
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const currentRequests = allRequests.slice(startIndex, endIndex);

      setHelpRequests(currentRequests);
    } catch (err) {
      console.error("Error fetching help requests:", err);
      setError("Failed to fetch help requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/help/requests/${id}`, {
        withCredentials: true,
      });

      // Refresh the current page
      await fetchHelpRequests();
      setDeleteConfirm({ show: false, id: null });
    } catch (err) {
      console.error("Error deleting help request:", err);
      alert("Failed to delete help request");
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPriorityColor = (createdAt) => {
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceCreated > 7) return "border-l-red-500";
    if (daysSinceCreated > 3) return "border-l-yellow-500";
    return "border-l-green-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={fetchHelpRequests}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Feedback</h1>
        <p className="text-gray-600 mt-2">
          Help requests and feedback from users
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-blue-600 text-2xl mr-4"
            />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {helpRequests.length}
              </p>
              <p className="text-gray-600">Current Page Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="text-green-600 text-2xl mr-4"
            />
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentPage}</p>
              <p className="text-gray-600">Current Page</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faFile}
              className="text-purple-600 text-2xl mr-4"
            />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPages}</p>
              <p className="text-gray-600">Total Pages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Requests List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Help Requests (Page {currentPage} of {totalPages})
          </h2>
        </div>

        {helpRequests.length === 0 ? (
          <div className="p-12 text-center">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-gray-400 text-6xl mb-4"
            />
            <p className="text-gray-500 text-lg">No help requests found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {helpRequests.map((request) => (
              <div
                key={request._id}
                className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(
                  request.createdAt
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-gray-400 mr-2"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.name || "Anonymous"}
                      </h3>
                      <span className="ml-2 text-sm text-gray-500">
                        {request.email || "No email provided"}
                      </span>
                    </div>

                    <div className="mb-2">
                      <h4 className="font-medium text-gray-800">
                        {request.subject}
                      </h4>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {request.message.substring(0, 150)}
                      {request.message.length > 150 && "..."}
                    </p>

                    <div className="flex items-center text-sm text-gray-500">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                      {formatDistanceToNow(new Date(request.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({ show: true, id: request._id })
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Help Request Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900">
                  {selectedRequest.name || "Anonymous"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">
                  {selectedRequest.email || "Not provided"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <p className="text-gray-900">{selectedRequest.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedRequest.message}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submitted
                </label>
                <p className="text-gray-900">
                  {formatDistanceToNow(new Date(selectedRequest.createdAt), {
                    addSuffix: true,
                  })}{" "}
                  ({new Date(selectedRequest.createdAt).toLocaleString()})
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm({ show: true, id: selectedRequest._id });
                  setShowModal(false);
                }}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this help request? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm({ show: false, id: null })}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;
