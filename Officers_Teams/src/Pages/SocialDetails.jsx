import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faCalendarAlt,
  faHeart,
  faComment,
  faThumbsUp,
  faFaceSmile,
  faFaceFrownOpen,
} from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";

function SocialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Get user ID
  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await axios.get("/officer/profile", {
          withCredentials: true,
        });
        setUserId(response.data._id);
      } catch (error) {
        console.error("Error getting user ID:", error);
      }
    };
    getUserId();
  }, []);

  const fetchIssueDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/issue/${id}`, {
        withCredentials: true,
      });
      setIssue(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching issue details:", error);
      setError("Failed to fetch post details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchIssueDetails();
  }, [fetchIssueDetails]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchIssueDetails();
  };

  const getReactionIcon = (reaction) => {
    switch (reaction) {
      case "likes":
        return faThumbsUp;
      case "loves":
        return faHeart;
      case "joys":
        return faFaceSmile;
      case "sads":
        return faFaceFrownOpen;
      default:
        return faThumbsUp;
    }
  };

  const getReactionColor = (reaction) => {
    switch (reaction) {
      case "likes":
        return "#3b82f6";
      case "loves":
        return "#ec4899";
      case "joys":
        return "#f59e0b";
      case "sads":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post details...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "Post not found"}</p>
          <button
            onClick={() => navigate("/social")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Social Feed
          </button>
        </div>
      </div>
    );
  }

  const userReaction = issue.reactedUsers?.find(
    (ru) => ru.user === userId || ru.user?._id === userId
  )?.reaction;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/social")}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Post Details</h1>
              <p className="text-sm text-gray-500">
                View-only mode for officers
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Main Post */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          {/* User Info */}
          <div className="flex items-center mb-4">
            {issue.createdBy?.profilePicture ? (
              <img
                src={issue.createdBy.profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-3"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {issue.createdBy?.name || "Unknown User"}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                {formatDistanceToNow(new Date(issue.createdAt), {
                  addSuffix: true,
                })}{" "}
                ({new Date(issue.createdAt).toLocaleString()})
              </div>
            </div>
            {/* Status Badge */}
            {issue.hasStatus && issue.status && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  issue.status
                )}`}
              >
                {issue.status}
              </span>
            )}
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-3">{issue.title}</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Image */}
          {issue.issuePicture && issue.issuePicture.trim() !== "" && (
            <div className="mb-6">
              <img
                src={issue.issuePicture}
                alt="Post"
                className="w-full max-h-96 object-cover rounded-lg cursor-pointer hover:opacity-90"
                onClick={() => window.open(issue.issuePicture, "_blank")}
              />
            </div>
          )}

          {/* Reaction Summary - Read Only */}
          {issue.reactions && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">
                Community Reactions
              </h4>
              <div className="flex items-center space-x-6">
                {issue.reactions.likes > 0 && (
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      className="mr-2"
                      style={{ color: "#3b82f6" }}
                      size="lg"
                    />
                    <span className="font-medium">
                      {issue.reactions.likes} Likes
                    </span>
                  </div>
                )}
                {issue.reactions.loves > 0 && (
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="mr-2"
                      style={{ color: "#ec4899" }}
                      size="lg"
                    />
                    <span className="font-medium">
                      {issue.reactions.loves} Loves
                    </span>
                  </div>
                )}
                {issue.reactions.joys > 0 && (
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faFaceSmile}
                      className="mr-2"
                      style={{ color: "#f59e0b" }}
                      size="lg"
                    />
                    <span className="font-medium">
                      {issue.reactions.joys} Joys
                    </span>
                  </div>
                )}
                {issue.reactions.sads > 0 && (
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faFaceFrownOpen}
                      className="mr-2"
                      style={{ color: "#6b7280" }}
                      size="lg"
                    />
                    <span className="font-medium">
                      {issue.reactions.sads} Sads
                    </span>
                  </div>
                )}
              </div>
              {!issue.reactions.likes &&
                !issue.reactions.loves &&
                !issue.reactions.joys &&
                !issue.reactions.sads && (
                  <p className="text-gray-500 italic">No reactions yet</p>
                )}
            </div>
          )}
        </div>

        {/* Comments Section - Read Only */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4">
            Comments ({issue.comments?.length || 0})
          </h3>

          {/* Officer Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> As an officer, you can view comments but
              cannot add new comments or reactions.
            </p>
          </div>

          {/* Comments List */}
          {issue.comments && issue.comments.length > 0 ? (
            <div className="space-y-4">
              {issue.comments
                .slice()
                .reverse()
                .map((comment, index) => (
                  <div
                    key={index}
                    className="flex space-x-3 p-4 bg-gray-50 rounded-lg"
                  >
                    {comment.user?.profilePicture ? (
                      <img
                        src={comment.user.profilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-gray-400"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-semibold text-gray-900">
                          {comment.user?.name || "Unknown User"}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          {comment.createdAt
                            ? formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                              })
                            : ""}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FontAwesomeIcon
                icon={faComment}
                className="text-gray-400 text-4xl mb-2"
              />
              <p className="text-gray-500">No comments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialDetails;
