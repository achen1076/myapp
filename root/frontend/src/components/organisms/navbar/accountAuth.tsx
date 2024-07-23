import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase-config.js";
import { User, onAuthStateChanged } from "firebase/auth";
import setNavbar from "../../molecules/navbar/setNavbar.tsx";

export function AccountAuth() {
  const [accountName, setAccountName] = useState("");
  const [UID, setUID] = useState("");

  const setData = async (user: User | null) => {
    if (user) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(db, currentUser.uid, "user");
        const docSnap = await getDoc(docRef);
        while (!docSnap.exists()) {}
        if (localStorage.getItem("IsAuth")) {
          if (docSnap.exists()) {
            const uid = currentUser.uid;
            setUID(uid);
            setAccountName(docSnap.data().name);
          }
        }
      }
    }
    setNavbar("fadeIn");
  };

  const loadData = async () => {
    onAuthStateChanged(auth, (user) => {
      setData(user);
    });
  };

  const localStorageUID: string | null = localStorage.getItem("UID");
  const localStorageName: string | null = localStorage.getItem("Name");

  if (!localStorage.getItem("IsAuth")) {
    loadData();
  } else if (localStorageUID && localStorageName) {
    setTimeout(() => {
      setNavbar("fadeIn");
    }, 100);
    return (
      <Link
        to={{
          pathname: `/account/${localStorageUID.replace(/"/g, "")}`,
        }}
      >
        <a className="navbar__item--account">
          <h1 className="nav__title--account no-highlight" id="accountNavTitle">
            {localStorageName.replace(/"/g, "")}
          </h1>
        </a>
      </Link>
    );
  } else {
    loadData();
  }
  return (
    <Link
      to={{
        pathname: `/account/${UID}`,
      }}
    >
      <a className="navbar__item--account">
        <h1 className="nav__title--account no-highlight" id="accountNavTitle">
          {accountName}
        </h1>
      </a>
    </Link>
  );
}

export function AccountAuthMenu() {
  const [UID, setUID] = useState("");

  const setData = async (user: User | null) => {
    if (user) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(db, currentUser.uid, "user");
        const docSnap = await getDoc(docRef);
        while (!docSnap.exists()) {}
        if (localStorage.getItem("IsAuth")) {
          if (docSnap.exists()) {
            const uid = currentUser.uid;
            setUID(uid);
          }
        }
      }
    }
    setNavbar("fadeIn");
  };

  const loadData = async () => {
    onAuthStateChanged(auth, (user) => {
      setData(user);
    });
  };

  const localStorageUID: string | null = localStorage.getItem("UID");
  const localStorageName: string | null = localStorage.getItem("Name");

  if (!localStorage.getItem("IsAuth")) {
    loadData();
  } else if (localStorageUID && localStorageName) {
    setTimeout(() => {
      setNavbar("fadeIn");
    }, 100);
    return (
      <Link
        to={{
          pathname: `/account/${localStorageUID.replace(/"/g, "")}`,
        }}
      >
        <a id="accountMenuLink">Account</a>
      </Link>
    );
  } else {
    loadData();
  }
  return (
    <Link
      to={{
        pathname: `/account/${UID}`,
      }}
    >
      <a id="accountMenuLink">Account</a>
    </Link>
  );
}
