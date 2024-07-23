import { minWidth } from "../../../utils/constants.tsx";

export default function setNavbar(event: string) {
  const width = window.innerWidth;
  const navContainer = document.getElementById("navContainer");
  const accountNavContainer = document.getElementById("accountNavContainer");
  const menuContainer = document.getElementById("menuContainer");
  const menuIcon = document.getElementById("menuIcon");
  const titleNavContainer = document.getElementById("titleNavContainer");
  if (
    navContainer &&
    accountNavContainer &&
    menuContainer &&
    menuIcon &&
    titleNavContainer
  ) {
    if (width <= minWidth) {
      navContainer.style.display = "none";
      accountNavContainer.style.display = "none";
      menuContainer.style.display = "inline-block";
      menuIcon.style.display = "inline-block";
      titleNavContainer.style.width = "80vw";
      titleNavContainer.classList.remove("right-border");
      navContainer.style.animation = `0.5s ${event} forwards`;
    }
    if (width > minWidth) {
      navContainer.style.display = "block";
      accountNavContainer.style.display = "block";
      menuContainer.style.display = "none";
      navContainer.style.animation = `0.5s ${event} forwards`;
      menuIcon.style.display = "none";
      titleNavContainer.style.width = "20vw";
      titleNavContainer.classList.add("right-border");
    }
  }
}
