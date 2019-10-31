import React, { useState, useContext } from 'react';
import CommContext from 'components/room/comm/CommContext';
import BigButton from 'components/common/BigButton';
import Game from 'components/room/Games';

const FeedbackPage = () => {
  const comm = useContext(CommContext);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isGood, setIsGood] = useState(true);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => setBody(e.target.value);
  const handleIsGoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsGood(e.target.checked);
  };
  const submitFeedback = () => {
    comm.submitFeedback(
      // Game hardcoded to SHAKE
      {
        game: Game.SHAKE, isGood, title, body,
      },
      () => alert('Feedback submitted successfully!'),
      (error, errorDescription) => alert(`Task failed successfully: ${JSON.stringify([error, errorDescription])}`),
    );
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor="title">
                Title:
                <input id="title" type="text" onChange={handleTitleChange} style={{ border: 'solid' }} />
              </label>
            </td>
          </tr>

          <tr>
            <td>
              <label htmlFor="body">
                Body:
                <input id="body" type="text" onChange={handleBodyChange} style={{ border: 'solid' }} />
              </label>
            </td>
          </tr>

          <tr>
            <td>
              <label htmlFor="isGood">
                <input id="isGood" type="checkbox" onChange={handleIsGoodChange} checked={isGood} />
                Good?
              </label>
            </td>
          </tr>

          <tr>
            <td>
              <BigButton onClick={submitFeedback}>Submit feedback</BigButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackPage;
