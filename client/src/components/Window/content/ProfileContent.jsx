import React from 'react';
import userAvatar from '../../../assets/icons/male-user.png';
import '../WindowContent.css';

/**
 * Profile Window Content
 * Displays introductory bio, retro avatar, and developer tagline.
 */
function ProfileContent() {
  return (
    <article className="window-profile">
      <div className="profile-top-row">
        <div className="profile-avatar-wrapper" aria-label="Profile Avatar">
          <img src={userAvatar} alt="Profile" className="profile-avatar-img" />
        </div>
        <div className="profile-intro">
          <p className="profile-greeting">hi! i'm</p>
          <h2 className="profile-name">Prashant Sharma</h2>
          <div className="profile-role">FULL STACK DEVELOPER</div>
          <p className="profile-quote">
            "Meaningful designs and robust full-stack systems built with intention."
          </p>
        </div>
      </div>

      <p className="profile-bio">
        Welcome to my retro desktop workspace! I am a software developer with a focus on modern web applications using the MERN stack (MongoDB, Express, React, Node.js). I enjoy crafting aesthetic, tactile user interfaces and clean architectural backends.
      </p>
    </article>
  );
}

export default ProfileContent;
