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

  // Handler for the comment input change
  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };
  const handleCommentSubmit = (event) => {
    event.preventDefault(); // Prevent the form from reloading the page

    // Create a new comment object
    const commentToAdd = {
      id: new Date().getTime(), // Mock ID, in a real app you'd get this from the backend
      content: newComment,
      // Other properties like username, createdAt, score, etc.
      // would be set according to your application's logic
    };

    // Add the new comment to the list of comments and clear the input
    setComments([...comments, commentToAdd]);
    setNewComment('');
  };


  return (
    <div className=''>
      {commentsData.comments.map(comment => (
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
              <div className='flex space-x-2 items-center'>
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
                {comment.replies.map((reply, index)=> (
                  <div key={reply.id} className='bg-white m-4 p-4 rounded-lg'>
                    <div className='flex'>
                      <img src={getImagePath(reply.user.username)} alt={reply.user.username} className='h-10 w-10 mr-8'/>
                      <div className='py-2 flex mb-4'>
                        <h2 className='dark-blue font-bold mr-2'>{reply.user.username}</h2>
                        {index !== 0 && (
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
                      {index === 0 && (
                        <div className='flex space-x-2 items-center'>
                          <img src={replyIcon} alt="" className='h-4 w-4'/>
                          <p className='blue-primary font-bold'>Reply</p>
                        </div>
                        )}
                      {index > 0 && (
                        <div className='flex space-x-2 items-center'>
                          <img src={deleteIcon} alt="" className='h-4 w-4'/>
                          <p className='red font-bold'>Delete</p>
                          <img src={editIcon} alt="" className='h-4 w-4'/>
                          <p className='blue-primary font-bold'>Edit</p>
                        </div>
                        )}
                    </div>
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
