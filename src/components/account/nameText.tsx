import React, { useState } from "react";
import { auth, db } from "C:/Users/achen/myapp/src/firebase-config.js";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth/cordova";
import { minWidth } from "../../utils/constants.tsx";

export default function NameText() {
  const [nameText, setNameText] = useState("");

  const onResize = () => {
    const width = window.innerWidth;
    const passwordSpan = document.getElementById("spanPassword");
    if (passwordSpan) {
      if (width <= minWidth) {
        passwordSpan.style.display = "block";
      }
      if (width > minWidth) {
        passwordSpan.style.display = "inline-flex";
      }
    }
  };

  const setData = async () => {
    if (localStorage.getItem("IsAuth")) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(db, currentUser.uid, "user");
        const docSnap = await getDoc(docRef);
        while (!docSnap.exists()) {}
        if (docSnap.exists()) {
          setNameText("Hello, " + docSnap.data().name + "!");
        }
      }
    }
    onResize();
  };
  const setUpPage = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const blurClassName = " blur-on-load";
        const blurredElements = [
          "container__welcome blur-on-load",
          "container__account blur-on-load",
        ];
        const blurredElementsID = [
          "welcomeContainer",
          "accountSettingContainer",
        ];
        setData();

        const welcomeNameText = document.getElementById("welcomeNameText");
        if (welcomeNameText) {
          welcomeNameText.style.animation =
            "1s cubic-bezier(0.56,-0.39, 0.4, 1.65) 0s 1 slideInFromLeft";
        }

        //   document.getElementById("loadingDots").style.display = "none";
        for (let index in blurredElements) {
          const element = blurredElements[index];
          const id = blurredElementsID[index];
          const blurredElement = document.getElementById(id);

          if (blurredElement) {
            blurredElement.className = element.replace(blurClassName, "");
          }
        }
      } else {
        window.location.href = "/login";
      }
    });
  };

  setUpPage();

  return (
    <h1 className="header__account header" id="welcomeNameText">
      {nameText}
    </h1>
  );
}
