import React from 'react';
import { Link } from 'react-router-dom';

export default function MenuBar() {

  const onMenuHover = (e) => {
    e.target.querySelector('div').style.display=""
  }

  const onMenuLeave = () => {
    const menuItems = document.getElementsByClassName("dropdown-menu-item");
    for(var index = 0; index < menuItems.length; ++index) 
      menuItems[index].style.display="none"
  }
   
  return (
    <div style={{ borderBottom: "1px solid black", display: "flex", flexDirection: "row", height: "2em", cursor:"pointer"}}>
      <div style={{ flexBasis: "150px" }}><Link to="/" style={{textDecoration:"none"}}>Logo</Link></div>
      <div className="dropdown-menu" style={{ flexBasis: "150px" }} onMouseEnter={(e)=>onMenuHover(e)} onMouseLeave={()=>onMenuLeave()}>For Runner
        <div className="dropdown-menu-item" style={{display:"none", position:"absolute"}}>
          <div>Serach</div>
          <div>My errand</div>
          <div>item 3</div> 
        </div>
      </div>
      <div className="dropdown-menu" style={{ flexBasis: "150px" }} onMouseEnter={(e)=>onMenuHover(e)} onMouseLeave={()=>onMenuLeave()}>For Poster
        <div className="dropdown-menu-item" style={{display:"none", position:"absolute"}}>
          <div>Post</div>
          <div>My errand</div>
          <div>item C</div>
        </div>
      </div>
      <div style={{ flexBasis: "100px", marginLeft: "auto"}}><Link to="/signin" style={{textDecoration:"none"}}>Sign in</Link></div>
    </div>
  )
}