import React from 'react';
import '../styles/SideNavigation.scss';


const SideNavigation = (props) => {

  return (
    <div className="side-nav-bar">
        <span className='side-nav-bar__logo'>
          <i className="fas fa-champagne-glasses"></i>
        </span>
        
        <div className='side-nav-bar__icon'>
          {/* <% if user is loggedin %> */}
          <div className='side-nav-bar__admin-control'>
            <i className="fas fa-house"></i>
            <i className="fas fa-user-plus"></i>
            <i className="fas fa-magnifying-glass"></i>
            <i className="fas fa-heart-circle-xmark"></i>
          </div>

          <div className='side-nav-bar__media-control'>
            <i className="fas fa-circle-pause"></i>
            <i className="fas fa-forward-step"></i>
          </div>
        
          <span className='side-nav-bar__logout'>
              <i className="fas fa-arrow-right-from-bracket"></i>
              {/*  onClick={goToLogOut} */}
          </span> 
        
          {/* <% else %> */}
          {/* <div className='side-nav-bar__login'>
            <i className="fas fa-arrow-right-to-bracket fa-rotate-180"></i> */}
            {/*  onClick={goToLogIn} */}
          {/* </div>  */}
            
        </div>
    </div>
  )

};

export default SideNavigation;