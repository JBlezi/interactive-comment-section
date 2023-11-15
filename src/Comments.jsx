import React, { useState, useEffect } from 'react';
import commentsData from './data.json';
import amyrobson from './images/avatars/image-amyrobson.png';
import juliusomo from './images/avatars/image-juliusomo.png';
import maxblagun from './images/avatars/image-maxblagun.png';
import ramsesmiron from './images/avatars/image-ramsesmiron.png';
import replyIcon from './images/icon-reply.svg';
import plusIcon from './images/icon-plus.svg';
import minusIcon from './images/icon-minus.svg';
import editIcon from './images/icon-edit.svg';
import deleteIcon from './images/icon-delete.svg';


const CommentsComponent = () => {

  const avatarMap = {
    amyrobson,
    juliusomo,
    maxblagun,
    ramsesmiron,
  };
  const getImagePath = (username) => {
    // The username should match the keys in the avatarMap
    return avatarMap[username];
  };



  // State for the list of comments and the new comment input
  const [comments, setComments] = useState(() => {
    // Try to load saved comments from localStorage
    const savedComments = localStorage.getItem('comments');
    // If there are saved comments, parse the JSON string back to an array
    // Otherwise, fall back to the initial comments data
    return savedComments ? JSON.parse(savedComments) : commentsData.comments;
  });
  const [newComment, setNewComment] = useState('');

  const [isReplying, setIsReplying] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);

  // Add state to keep track of the reply being edited
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState('');

  // Add state to keep track of the reply being edited
  const [editingComment, setEditingComment] = useState(null);
  const [editComment, setEditComment] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    // Convert comments array to a JSON string and save in localStorage
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]); // This effect runs whenever the comments state changes


  const showDeleteModal = (commentId, replyId) => {
    setIsDeleteModalOpen(true);
    setItemToDelete({ commentId, replyId });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDeleteComment(itemToDelete.commentId, itemToDelete.replyId);
      closeDeleteModal();
    }
  };

  const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
        <div className="p-8 rounded-lg fixed top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 bg-white max-w-md">
          <h2 className='font-bold text-2xl dark-blue'>Delete comment</h2>
          <p className='my-4'>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
          <div className='flex mt-4 space-x-4'>
            <button onClick={onCancel} className='bg-grey-blue text-white py-4 px-8 font-bold rounded-lg hover:opacity-50'>NO, CANCEL</button>
            <button onClick={onConfirm} className='bg-tomato text-white py-4 px-8 font-bold rounded-lg hover:opacity-50'>YES, DELETE</button>
          </div>
        </div>
      </div>
    );
  };




  // Function to handle initiating the edit of a comment
  const handleEditComment = (comment) => {
  setEditingComment({ commentId: comment.id });
  setEditComment(comment.content);
  };

  // Function to handle initiating the edit of a reply
  const handleEditReply = (commentId, reply) => {
  setEditing({ commentId, replyId: reply.id });
  setEditText(reply.content);
  };

  // Function to handle the change of edit text
  const handleEditCommentChange = (event) => {
    setEditComment(event.target.value);
  };

  // Function to handle the change of edit text
  const handleEditTextChange = (event) => {
    setEditText(event.target.value);
  };

  const handleSaveEditComment = () => {
      // Check if we're editing a comment or a reply
      if (editingComment.commentId) {
        // We're editing an original comment
        setComments(comments.map(comment => {
          if (comment.id === editingComment.commentId) {
            // Update the content of the original comment
            return { ...comment, content: editComment };
          }
          return comment;
        }));
      }

      setEditingComment(null);
      setEditComment('');
  }

  // Function to save the edited comment or reply
  const handleSaveEdit = () => {
    // Check if we're editing a comment or a reply
    if (editing.replyId) {
      // Update the comments state with the edited reply
      setComments(comments.map(comment => {
        if (comment.id === editing.commentId) {
          // Map through the replies to find and update the edited reply
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === editing.replyId) {
              return { ...reply, content: editText };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      }));
    }

    // Reset editing state and clear edit text
    setEditing(null);
    setEditText('');
  };


  //


    // Function to show the reply form
    const showReplyForm = (commentId) => {
      setIsReplying(true);
      setActiveCommentId(commentId);
    };


    // Handler for the comment input change
    const handleNewCommentChange = (event) => {
      setNewComment(event.target.value);
    };

    const handleCommentSubmit = (event) => {
      event.preventDefault(); // Prevent the form from reloading the page

      const newCommentObject = {
        id: new Date().getTime(),
        content: newComment,
        createdAt: new Date().toISOString(),
        score: 0,
        user: {
          image: { png: juliusomo }, // Replace with actual image path or logic
          username: 'juliusomo' // Replace with the current user's username
        },
        replies: []
      };

      if (activeCommentId) {
        // We are adding a reply to an existing comment
        const parentComment = comments.find(comment => comment.id === activeCommentId);
        newCommentObject.replyingTo = parentComment.user.username;

        setComments(comments.map(comment => {
          if (comment.id === activeCommentId) {
            return {
              ...comment,
              replies: [...comment.replies, newCommentObject]
            };
          }
          return comment;
        }));
      } else {
        // We are adding an original comment
        setComments([...comments, newCommentObject]);
      }

      // Reset the input fields and state
      setNewComment('');
      setIsReplying(false);
      setActiveCommentId(null);
    };


      const handleDeleteComment = (commentId, replyId) => {
        // If replyId is provided, delete the reply from the specific comment's replies
        if (replyId) {
          setComments(comments.map(comment => {
            if (comment.id === commentId) {
              // Filter out the reply that needs to be deleted
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== replyId)
              };
            }
            return comment;
          }));
        } else {
          // If no replyId is provided, delete the comment itself from the comments array
          setComments(comments.filter(comment => comment.id !== commentId));
        }
      };


      // This function takes in the ISO timestamp from the createdAt property
    // and returns a string representing how long ago the comment was created
    const timeAgo = (createdAt) => {
      const date = new Date(createdAt);
      const now = new Date();
      const secondsAgo = Math.round((now - date) / 1000);
      const minutesAgo = Math.round(secondsAgo / 60);
      const hoursAgo = Math.round(minutesAgo / 60);
      const daysAgo = Math.round(hoursAgo / 24);

      if (secondsAgo < 60) {
        return `${secondsAgo} seconds ago`;
      } else if (minutesAgo < 60) {
        return `${minutesAgo} minutes ago`;
      } else if (hoursAgo < 24) {
        return `${hoursAgo} hours ago`;
      } else {
        return `${daysAgo} days ago`;
      }
    };

    const handleVote = (commentId, replyId, delta) => {
      setComments(comments.map(comment => {
        if (replyId && comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === replyId) {
                // Ensure userVote is a number before adding delta
                const currentVote = reply.userVote || 0;
                // Apply the delta if the current vote and delta are not canceling each other out
                // or if there's no vote yet
                if ((currentVote === 1 && delta === -1) || (currentVote === -1 && delta === 1) || currentVote === 0) {
                  return { ...reply, score: reply.score + delta, userVote: currentVote + delta };
                }
              }
              return reply;
            }),
          };
        } else if (!replyId && comment.id === commentId) {
          // Similar logic for comments
          const currentVote = comment.userVote || 0;
          if ((currentVote === 1 && delta === -1) || (currentVote === -1 && delta === 1) || currentVote === 0) {
            return { ...comment, score: comment.score + delta, userVote: currentVote + delta };
          }
        }
        return comment;
      }));
    };






  return (
    <div className=''>
      {comments.map(comment => (
        <div key={comment.id}>
          <div className='bg-white m-4 p-4 rounded-lg'>
                    {editingComment && editingComment.commentId === comment.id ? (
                      <div className='flex flex-col'>
                        <input
                          type="text"
                          value={editComment}
                          onChange={handleEditCommentChange}
                          className="reply-edit-input w-full h-32 rounded-lg border-grey border cursor-pointer"
                        />
                        <div className='flex justify-between mt-4'>
                          <img src={juliusomo} alt="" className='h-12 w-12'/>
                          <button onClick={handleSaveEditComment} className="save-edit-btn bg-blue-primary text-white font-bold py-4 px-8 rounded-lg hover:opacity-50">SAVE</button>
                        </div>
                      </div>
                    ) : (
                      <div className='flex flex-col'>
                        <div className='flex'>
                          <img src={getImagePath(comment.user.username)} alt={comment.user.username} className='h-10 w-10 mr-8'/>
                          <div className='py-2 flex mb-4'>
                            <h2 className='dark-blue font-bold mr-2'>{comment.user.username}</h2>
                            {comment.user.username === "juliusomo" && (
                              <div className='flex'>
                                <p className='bg-blue-primary px-2 mr-2 rounded-sm text-white'>you</p>
                                <p className='grey-blue font-medium'>{timeAgo(comment.createdAt)}</p>
                              </div>
                            )}
                            {comment.user.username !== "juliusomo" && (
                              <p className='grey-blue font-medium'>{comment.createdAt}</p>
                            )}
                          </div>
                        </div>
                        <p className='grey-blue mb-4'>{comment.content}</p>
                        <div className='flex justify-between'>
                          <div className='flex space-x-2 bg-grey p-2 rounded-lg items-center'>
                            <img src={plusIcon} alt="" className='h-4 w-4 cursor-pointer' onClick={() => handleVote(comment.id, null, 1)}/>
                            <p className='dark-blue font-bold'>{comment.score}</p>
                            <img src={minusIcon} alt="" className='h-1 w-4 cursor-pointer' onClick={() => handleVote(comment.id, null, -1)}/>
                          </div>
                          {comment.user.username !== "juliusomo" && (
                            <div className='flex space-x-2 items-center cursor-pointer hover:opacity-50' onClick={() => showReplyForm(comment.id)}>
                              <img src={replyIcon} alt="" className='h-4 w-4'/>
                              <p className='blue-primary font-bold'>REPLY</p>
                            </div>
                          )}
                          {comment.user.username === "juliusomo" && (
                            <div className='flex space-x-4 items-center'>
                              <div className="flex space-x-2 items-center cursor-pointer hover:opacity-50" onClick={() => showDeleteModal(comment.id, null)}>
                                <img src={deleteIcon} alt="" className='h-4 w-4'/>
                                <p className='red font-bold'>DELETE</p>
                              </div>
                              <div className="flex space-x-2 items-center cursor-pointer hover:opacity-50" onClick={() => handleEditComment(comment)}>
                                <img src={editIcon} alt="" className='h-4 w-4'/>
                                <p className='blue-primary font-bold'>EDIT</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

          </div>
          <div className='flex'>
            <div className='border-l-2 border-grey w-[1%] ml-4'>
            </div>
            <div className='w-[99%]'>
            <div className='bg-white rounded-lg m-4'>
              {isReplying && activeCommentId === comment.id && (
                <form onSubmit={handleCommentSubmit} className='flex flex-col'>
                  <input
                    type="text"
                    value={newComment}
                    onChange={handleNewCommentChange}
                    placeholder="    Add a comment..."
                    className='w-fit-container m-4 h-32 rounded-lg border-grey border cursor-pointer'
                  />
                  <div className='flex justify-between my-4'>
                    <img src={juliusomo} alt="" className='h-12 w-12 mx-4'/>
                    <button type="submit" className='mx-4 bg-blue-primary text-white py-4 px-8 rounded-lg hover:opacity-50 font-bold'>
                      SEND
                    </button>
                  </div>
                </form>
              )}
            </div>
            {comment.replies && comment.replies.length > 0 && (
              <div className=''>
                {comment.replies.map((reply, index) => (
                  <div key={reply.id} className='bg-white m-4 p-4 rounded-lg'>
                    {editing && editing.replyId === reply.id ? (
                      <div className='flex flex-col'>
                        <input
                          type="text"
                          value={editText}
                          onChange={handleEditTextChange}
                          className="reply-edit-input w-full h-32 rounded-lg border-grey border"
                        />
                        <div className='flex justify-between mt-4'>
                          <img src={juliusomo} alt="" className='h-12 w-12'/>
                          <button onClick={handleSaveEdit} className="save-edit-btn bg-blue-primary text-white font-bold py-4 px-8 rounded-lg hover:opacity-50">SAVE</button>
                        </div>
                      </div>
                    ) : (
                      <div className='flex flex-col'>
                        <div className='flex'>
                          <img src={getImagePath(reply.user.username)} alt={reply.user.username} className='h-10 w-10 mr-8'/>
                          <div className='py-2 flex mb-4'>
                            <h2 className='dark-blue font-bold mr-2'>{reply.user.username}</h2>
                            {reply.user.username === "juliusomo" && reply.replyingTo !== "ramsesmiron" && (
                              <div className='flex'>
                                <p className='bg-blue-primary px-2 mr-2 rounded-sm text-white'>you</p>
                                <p className='grey-blue font-medium'>{timeAgo(reply.createdAt)}</p>
                              </div>
                            )}
                            {(reply.user.username !== "juliusomo" || (reply.user.username === "juliusomo" && reply.replyingTo === "ramsesmiron")) && (
                              <p className='grey-blue font-medium'>{reply.createdAt}</p>
                            )}
                          </div>
                        </div>
                        <p className='grey-blue mb-4'><span className='blue-primary font-bold'>@{reply.replyingTo}</span> {reply.content}</p>
                        <div className='flex justify-between'>
                          <div className='flex space-x-2 bg-grey p-2 rounded-lg items-center'>
                            <img src={plusIcon} alt="" className='h-4 w-4 cursor-pointer' onClick={() => handleVote(comment.id, reply.id, 1)}/>
                            <p className='dark-blue font-bold'>{reply.score}</p>
                            <img src={minusIcon} alt="" className='h-1 w-4 cursor-pointer' onClick={() => handleVote(comment.id, reply.id, -1)}/>
                          </div>
                          {reply.user.username === "juliusomo" && (
                            <div className='flex space-x-4 items-center'>
                              <div className="flex space-x-2 items-center cursor-pointer hover:opacity-50" onClick={() => showDeleteModal(comment.id, reply ? reply.id : null)}>
                                <img src={deleteIcon} alt="" className='h-4 w-4'/>
                                <p className='red font-bold'>DELETE</p>
                              </div>
                              <div className="flex space-x-2 items-center cursor-pointer hover:opacity-50" onClick={() => handleEditReply(comment.id, reply)}>
                                <img src={editIcon} alt="" className='h-4 w-4'/>
                                <p className='blue-primary font-bold'>EDIT</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      ))}
      <div className='bg-white rounded-lg m-4'>
        <form onSubmit={handleCommentSubmit} className='flex flex-col'>
          <input
            type="text"
            value={newComment}
            onChange={handleNewCommentChange}
            placeholder="    Add a comment..."
            className='w-fit-container m-4 h-32 rounded-lg border-grey border cursor-pointer'
          />
          <div className='flex justify-between my-4'>
            <img src={juliusomo} alt="" className='h-12 w-12 mx-4'/>
            <button type="submit" className='mx-4 bg-blue-primary text-white py-4 px-8 font-bold rounded-lg hover:opacity-50'>
              SEND
            </button>
          </div>
        </form>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />


    </div>
  );
}

export default CommentsComponent;
