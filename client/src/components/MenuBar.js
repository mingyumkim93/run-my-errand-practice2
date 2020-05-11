import React from "react";
import history from "../history";
import API from "../utils/API";

export default function MenuBar(props) {

  const onMenuHover = (e) => {
    e.target.parentElement.querySelector("div").style.display = ""
  };

  const onMenuLeave = () => {
    const menuItems = document.getElementsByClassName("dropdown-menu-item");
    for (var index = 0; index < menuItems.length; ++index)
      menuItems[index].style.display = "none"
  };

  return (
    <div style={{ borderBottom: "1px solid black", display: "flex", flexDirection: "row", height: "3em", cursor: "pointer" }}>
      <div style={{ flexBasis: "150px" }}><button onClick={() => history.push("/")}>Logo</button></div>
      <div className="dropdown-menu" style={{ flexBasis: "150px" }} onMouseLeave={() => onMenuLeave()}>
        <button onClick={() => history.push("/search")} onMouseOver={(e) => onMenuHover(e)} >For Runner</button>
        <div className="dropdown-menu-item" style={{ display: "none", position: "absolute", backgroundColor: "white" }}>
          <button onClick={() => history.push("/search")}>Search</button>
          <div>My errand</div>
        </div>
      </div>
      <div className="dropdown-menu" style={{ flexBasis: "150px" }} onMouseLeave={() => onMenuLeave()}>
        <button onClick={() => history.push("/post")} onMouseOver={(e) => onMenuHover(e)}>For Poster</button>
        <div className="dropdown-menu-item" style={{ display: "none", position: "absolute", backgroundColor: "white" }}>
          <button onClick={() => history.push("/post")} >Post</button>
          <div>My errand</div>
          <div>item C</div>
        </div>
      </div>
      {props.user ? <div onClick={() => history.push("/inbox")} style={{ flexBasis: "100px", marginLeft: "auto" }}>Message{props.numberOfUnreadMessages}</div> :
        <div style={{ flexBasis: "100px", marginLeft: "auto" }}></div>}
      {props.user ? <div style={{ flexBasis: "100px", marginLeft: "auto" }}>Welcome {props.user.firstname}</div> :
        <div style={{ flexBasis: "100px", marginLeft: "auto" }}></div>}
      <div style={{ flexBasis: "100px" }}>
        {props.user ? <div onClick={() => {
          history.push("/")
          props.setUser(undefined);
          API.auth.logout().then((res) => console.log(res))
        }}>Sign out</div>
          : <button onClick={() => history.push("/signin")}>Sign in</button>}
      </div>
    </div>
  );
};