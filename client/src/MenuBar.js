import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function MenuBar() {

  const onMenuHover = (e) => {
    e.target.parentElement.querySelector('div').style.display=""
  }

  const onMenuLeave = () => {
    const menuItems = document.getElementsByClassName("dropdown-menu-item");
    for(var index = 0; index < menuItems.length; ++index) 
      menuItems[index].style.display="none"
  }
   
  return (
    <div style={{ borderBottom: "1px solid black", display: "flex", flexDirection: "row", height: "3em", cursor:"pointer"}}>
      <div style={{ flexBasis: "150px" }}><Link to="/" style={{textDecoration:"none"}}>Logo</Link></div> 
      <div className="dropdown-menu" style={{ flexBasis: "150px"}} onMouseLeave={()=>onMenuLeave()}>
        <Link to="/search" style={{textDecoration:"none"}} onMouseOver={(e)=>onMenuHover(e)} >For Runner</Link>
        <div className="dropdown-menu-item" style={{display:"none", position:"absolute", backgroundColor:"white"}}>
        <Link to="/search" style={{textDecoration:"none"}}>Search</Link>
          <div>My errand</div>
          <div onClick={()=>axios.get("/api/hello").then((res)=>console.log(res))}>server test</div> 
        </div>
      </div>
      <div className="dropdown-menu" style={{ flexBasis: "150px" }} onMouseLeave={()=>onMenuLeave()}>
      <Link to="/post" style={{textDecoration:"none"}} onMouseOver={(e)=>onMenuHover(e)}>For Poster</Link>
        <div className="dropdown-menu-item" style={{display:"none", position:"absolute", backgroundColor:"white"}}>
        <Link to="/post" style={{textDecoration:"none"}}>Post</Link>
          <div>My errand</div>
          <div>item C</div>
        </div>
      </div>
      <div style={{ flexBasis: "100px", marginLeft: "auto"}}><Link to="/signin" style={{textDecoration:"none"}}>Sign in</Link></div>
    </div>
  )
}