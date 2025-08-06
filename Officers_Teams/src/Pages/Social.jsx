import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHeart,
  faComment,
  faCalendarAlt,
  faEye,
  faThumbsUp,
  faFaceSmile,
  faFaceFrownOpen,
} from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";

function Social() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  // Get user ID from localStorage or auth context
  useEffect(() => {
    const getUserId = async () => {
      try {
        // Get user profile to extract user ID
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

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/issue/", {
        withCredentials: true,
      });
      setIssues(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching issues:", error);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchIssues();
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

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading social feed...</p>
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
            onClick={fetchIssues}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
            <div className="text-sm text-gray-500">
              View-only mode for officers
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Community posts and discussions from users
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-4">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh Feed"}
          </button>
        </div>

        {/* Posts */}
        {issues.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faComment}
              className="text-gray-400 text-6xl mb-4"
            />
            <p className="text-gray-500 text-lg">No posts found</p>
            <p className="text-gray-400">No community posts available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => {
              const userReaction = issue.reactedUsers?.find(
                (ru) => ru.user === userId || ru.user?._id === userId
              )?.reaction;

              return (
                <div
                  key={issue._id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  {/* User Info Header */}
                  <div className="flex items-center p-4 border-b border-gray-100">
                    {issue.createdBy?.profilePicture ? (
                      <img
                        src={issue.createdBy.profilePicture}
                        alt="Profile"
                        className="w-12 h-12 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-gray-400"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {issue.createdBy?.name || "Unknown User"}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="mr-1"
                        />
                        {formatDistanceToNow(new Date(issue.createdAt), {
                          addSuffix: true,
                        })}
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
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{issue.title}</h2>
                    <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">
                      {issue.description}
                    </p>
                  </div>

                  {/* Image */}
                  {issue.issuePicture && issue.issuePicture.trim() !== "" && (
                    <div className="px-4 pb-4">
                      <img
                        src={issue.issuePicture}
                        alt="Post"
                        className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90"
                        onClick={() =>
                          window.open(issue.issuePicture, "_blank")
                        }
                      />
                    </div>
                  )}

                  {/* Reaction Summary and Stats */}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      {/* Reaction Summary */}
                      {issue.reactions && (
                        <div className="flex items-center space-x-4">
                          {issue.reactions.likes > 0 && (
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faThumbsUp}
                                className="mr-1"
                                style={{ color: "#3b82f6" }}
                              />
                              <span>{issue.reactions.likes}</span>
                            </div>
                          )}
                          {issue.reactions.loves > 0 && (
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faHeart}
                                className="mr-1"
                                style={{ color: "#ec4899" }}
                              />
                              <span>{issue.reactions.loves}</span>
                            </div>
                          )}
                          {issue.reactions.joys > 0 && (
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faFaceSmile}
                                className="mr-1"
                                style={{ color: "#f59e0b" }}
                              />
                              <span>{issue.reactions.joys}</span>
                            </div>
                          )}
                          {issue.reactions.sads > 0 && (
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faFaceFrownOpen}
                                className="mr-1"
                                style={{ color: "#6b7280" }}
                              />
                              <span>{issue.reactions.sads}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Comments Count and View Details */}
                      <div className="flex items-center space-x-4">
                        {issue.comments && issue.comments.length > 0 && (
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faComment}
                              className="mr-1"
                            />
                            <span>{issue.comments.length} comments</span>
                          </div>
                        )}
                        <button
                          onClick={() => navigate(`/social/${issue._id}`)}
                          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Social;
