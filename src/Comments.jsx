import React, { useState } from 'react';
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
  const [comments, setComments] = useState(commentsData.comments);
  const [newComment, setNewComment] = useState('');

  const [isReplying, setIsReplying] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);

    // Function to show the reply form
    const showReplyForm = (commentId) => {
      setIsReplying(true);
      setActiveCommentId(commentId);
    };



    // Handler for the comment input change
    const handleNewCommentChange = (event) => {
      setNewComment(event.target.value);
    };

      // Handler for the form submission
      const handleCommentSubmit = (event) => {
        event.preventDefault(); // Prevent the form from reloading the page

        // Create a new reply object
        const replyToAdd = {
          id: new Date().getTime(),
          content: newComment,
          createdAt: timeAgo(new Date().toISOString()),
          score: 0,
          replyingTo: comments.find(comment => comment.id === activeCommentId).user.username,
          user: {
            image: { png: juliusomo }, // Replace with actual image path or logic
            username: 'juliusomo' // Replace with the current user's username
          }
        };

        // Add the new reply to the replies array of the parent comment
        setComments(comments.map(comment => {
          if (comment.id === activeCommentId) {
            // If we're at the parent comment, add the new reply to its replies array
            return {
              ...comment,
              replies: [...comment.replies, replyToAdd]
            };
          } else {
            // If we're not at the parent comment, return the comment unchanged
            return comment;
          }
        }));

        // Reset the input field and hide the reply form
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




  return (
    <div className=''>
      {comments.map(comment => (
        <div key={comment.id}>
          <div className='bg-white m-4 p-4 rounded-lg'>
            <div className='flex'>
              <img src={getImagePath(comment.user.username)} alt={comment.user.username} className='h-10 w-10 mr-8'/>
              <div className='py-2 flex mb-4'>
                <h2 className='dark-blue font-bold mr-4'>{comment.user.username}</h2>
                <p className='grey-blue font-medium'>{comment.createdAt}</p>
              </div>
            </div>
            <p className='grey-blue mb-4'>{comment.content}</p>
            <div className='flex justify-between'>
              <div className='flex space-x-2 bg-grey p-2 rounded-lg items-center'>
                <img src={plusIcon} alt="" className='h-4 w-4'/>
                <p className='dark-blue font-bold'>{comment.score}</p>
                <img src={minusIcon} alt="" className='h-1 w-4'/>
              </div>
              <div className='flex space-x-2 items-center cursor-pointer' onClick={() => showReplyForm(comment.id)}>
                <img src={replyIcon} alt="" className='h-4 w-4'/>
                <p className='blue-primary font-bold'>Reply</p>
              </div>
            </div>
          </div>
          <div className='flex'>
            <div className='border-l-2 border-grey w-[1%] ml-4'>
            </div>
            <div className='w-[99%]'>
            {comment.replies && comment.replies.length > 0 && (
              <div className=''>
                {comment.replies.map(reply=> (
                  <div key={reply.id} className='bg-white m-4 p-4 rounded-lg'>
                    <div className='flex'>
                      <img src={getImagePath(reply.user.username)} alt={reply.user.username} className='h-10 w-10 mr-8'/>
                      <div className='py-2 flex mb-4'>
                        <h2 className='dark-blue font-bold mr-2'>{reply.user.username}</h2>
                        {reply.user.username === "juliusomo" && (
                        <p className='bg-blue-primary px-2 mr-2 rounded-sm text-white'>you</p>
                        )}
                        <p className='grey-blue font-medium'>{reply.createdAt}</p>
                      </div>
                    </div>
                    <p className='grey-blue mb-4'><span className='blue-primary font-bold'>@{reply.replyingTo}</span> {reply.content}</p>
                    <div className='flex justify-between'>
                      <div className='flex space-x-2 bg-grey p-2 rounded-lg items-center'>
                        <img src={plusIcon} alt="" className='h-4 w-4'/>
                        <p className='dark-blue font-bold'>{reply.score}</p>
                        <img src={minusIcon} alt="" className='h-1 w-4'/>
                      </div>
                      {reply.user.username !== "juliusomo" && (
                        <div className='flex space-x-2 items-center cursor-pointer' onClick={() => showReplyForm(comment.id)}>
                          <img src={replyIcon} alt="" className='h-4 w-4'/>
                          <p className='blue-primary font-bold'>Reply</p>
                        </div>
                        )}
                      {reply.user.username === "juliusomo" && (
                        <div className='flex space-x-4 items-center'>
                          <div className="flex space-x-2 items-center cursor-pointer" onClick={() => handleDeleteComment(comment.id, reply.id)}>
                            <img src={deleteIcon} alt="" className='h-4 w-4'/>
                            <p className='red font-bold'>Delete</p>
                          </div>
                          <div className="flex space-x-2 items-center">
                            <img src={editIcon} alt="" className='h-4 w-4'/>
                            <p className='blue-primary font-bold'>Edit</p>
                          </div>
                        </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
          <div className='bg-white rounded-lg m-4'>
            {isReplying && activeCommentId === comment.id && (
              <form onSubmit={handleCommentSubmit} className='flex flex-col'>
                <input
                  type="text"
                  value={newComment}
                  onChange={handleNewCommentChange}
                  placeholder="    Add a comment..."
                  // Any other input attributes and styling classes
                  className='w-fit-container m-4 h-32 rounded-lg border-grey border'
                />
                <div className='flex justify-between my-4'>
                  <img src={juliusomo} alt="" className='h-12 w-12 mx-4'/>
                  <button type="submit" className='mx-4 bg-blue-primary text-white py-4 px-8 rounded-lg'>
                    SEND
                  </button>
                </div>
              </form>
            )}
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
            // Any other input attributes and styling classes
            className='w-fit-container m-4 h-32 rounded-lg border-grey border'
          />
          <div className='flex justify-between my-4'>
            <img src={juliusomo} alt="" className='h-12 w-12 mx-4'/>
            <button type="submit" className='mx-4 bg-blue-primary text-white py-4 px-8 rounded-lg'>
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommentsComponent;
