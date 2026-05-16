// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import API from "../api/axios";

export const AuthContext =
  createContext(null);

/* ================= CUSTOM HOOK ================= */

export const useAuth = () =>
  useContext(AuthContext);

/* ================= PROVIDER ================= */

export const AuthProvider = ({
  children,
}) => {
  const [user, setUserState] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const refreshTimerRef =
    useRef(null);

  /* ================= ACCESS TOKEN ================= */

  const setAccessToken = (
    token
  ) => {
    window.__accessToken = token;
  };

  /* ================= PARSE TOKEN EXPIRY ================= */

  const parseTokenExpiry = (
    token
  ) => {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return (
        payload.exp * 1000 -
        Date.now()
      );
    } catch {
      return 14 * 60 * 1000;
    }
  };

  /* ================= SCHEDULE REFRESH ================= */

  const scheduleRefresh =
    useCallback(
      (expiresInMs) => {
        if (
          refreshTimerRef.current
        ) {
          clearTimeout(
            refreshTimerRef.current
          );
        }

        const delay = Math.max(
          expiresInMs - 60_000,
          5_000
        );

        refreshTimerRef.current =
          setTimeout(async () => {
            try {
              const { data } =
                await API.post(
                  "/auth/refresh"
                );

              setAccessToken(
                data.accessToken
              );

              setUserState(
                data.user
              );

              scheduleRefresh(
                parseTokenExpiry(
                  data.accessToken
                )
              );
            } catch {
              setAccessToken(null);

              setUserState(null);
            }
          }, delay);
      },
      []
    );

  /* ================= RESTORE SESSION ================= */

  useEffect(() => {
    const restoreSession =
      async () => {
        try {
          const { data } =
            await API.post(
              "/auth/refresh"
            );

          setAccessToken(
            data.accessToken
          );

          setUserState(data.user);

          scheduleRefresh(
            parseTokenExpiry(
              data.accessToken
            )
          );
        } catch {
          setAccessToken(null);

          setUserState(null);
        } finally {
          setLoading(false);
        }
      };

    restoreSession();

    return () => {
      if (
        refreshTimerRef.current
      ) {
        clearTimeout(
          refreshTimerRef.current
        );
      }
    };
  }, [scheduleRefresh]);

  /* ================= SET USER ================= */

  const setUser = (
    userData,
    accessToken
  ) => {
    if (accessToken) {
      setAccessToken(
        accessToken
      );

      scheduleRefresh(
        parseTokenExpiry(
          accessToken
        )
      );
    }

    setUserState(userData);
  };

  /* ================= LOGOUT ================= */

  const logout = async () => {
    try {
      await API.post(
        "/auth/logout"
      );
    } catch {
      /* ignore */
    }

    setAccessToken(null);

    setUserState(null);

    if (
      refreshTimerRef.current
    ) {
      clearTimeout(
        refreshTimerRef.current
      );
    }
  };

  /* ================= AUTH STATE ================= */

  const isAuthenticated =
    !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;