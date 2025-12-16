import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { assertUnreachable, getMaxPage } from "../utils/utils";
import { State } from "../model/state";
import { UserNode } from "../model/user";
import { WHITELISTED_RESULTS_STORAGE_KEY } from "../constants/constants";
import { TranslationKey } from "../constants/translations";
import { UNFOLLOWERS_PER_PAGE } from "../constants/constants";


export interface SearchingProps {
  state: State;
  setState: (state: State) => void;
  scanningPaused: boolean;
  pauseScan: () => void;
  handleScanFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleUser: (checked: boolean, user: UserNode) => void;
  UserCheckIcon: React.FC;
  UserUncheckIcon: React.FC;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

export const Searching = ({
  state,
  setState,
  scanningPaused,
  pauseScan,
  handleScanFilter,
  toggleUser,
  UserCheckIcon,
  UserUncheckIcon,
  sidebarOpen,
  setSidebarOpen,
  t,
}: SearchingProps) => {
  if (state.status !== "scanning") {
    return null;
  }

  const listRef = useRef<HTMLDivElement | null>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [renderRange, setRenderRange] = useState({ start: 0, end: 0 });

  // Estimate item height for virtualization (approx. avatar row height)
  const ITEM_HEIGHT = 96; // px
  const BUFFER_ROWS = 3;

  const whitelistedIds = useMemo(() => new Set(state.whitelistedResults.map(user => user.id)), [state.whitelistedResults]);

  const usersForDisplay = useMemo(() => {
    const searchTerm = state.searchTerm.toLowerCase();
    const filtered: UserNode[] = [];
    for (const result of state.results) {
      const isWhitelisted = whitelistedIds.has(result.id);
      if (state.currentTab === "non_whitelisted" && isWhitelisted) {
        continue;
      }
      if (state.currentTab === "whitelisted" && !isWhitelisted) {
        continue;
      }
      if (!state.filter.showPrivate && result.is_private) {
        continue;
      }
      if (!state.filter.showVerified && result.is_verified) {
        continue;
      }
      if (!state.filter.showFollowers && result.follows_viewer) {
        continue;
      }
      if (!state.filter.showNonFollowers && !result.follows_viewer) {
        continue;
      }
      if (!state.filter.showWithOutProfilePicture && result.profile_pic_url.includes("default_profile_400x400")) {
        continue;
      }
      if (
        state.searchTerm !== "" &&
        !(result.username.toLowerCase().includes(searchTerm) || result.full_name.toLowerCase().includes(searchTerm))
      ) {
        continue;
      }
      filtered.push(result);
    }
    return filtered;
  }, [state.results, state.results.length, whitelistedIds, state.currentTab, state.filter, state.searchTerm]);

  const sortedUsersForDisplay = useMemo(() => {
    return [...usersForDisplay].sort((a, b) => (a.username > b.username ? 1 : -1));
  }, [usersForDisplay]);

  const pageUsers = useMemo(() => {
    const start = UNFOLLOWERS_PER_PAGE * (state.page - 1);
    return sortedUsersForDisplay.slice(start, start + UNFOLLOWERS_PER_PAGE);
  }, [sortedUsersForDisplay, state.page]);

  const totalVisible = pageUsers.length;

  useLayoutEffect(() => {
    const height = listRef.current?.clientHeight ?? 0;
    setViewportHeight(height);
    const rowsInView = height ? Math.ceil(height / ITEM_HEIGHT) + BUFFER_ROWS * 2 : totalVisible;
    setRenderRange({ start: 0, end: Math.min(totalVisible, rowsInView) });
  }, [pageUsers, totalVisible]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const height = viewportHeight || listRef.current?.clientHeight || 0;
    const rowsInView = height ? Math.ceil(height / ITEM_HEIGHT) + BUFFER_ROWS * 2 : totalVisible;
    const scrollTop = e.currentTarget.scrollTop;
    const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_ROWS);
    const end = Math.min(totalVisible, start + rowsInView);
    setRenderRange({ start, end });
  };

  const virtualItems = pageUsers.slice(renderRange.start, renderRange.end);
  const paddingTop = renderRange.start * ITEM_HEIGHT;
  const paddingBottom = Math.max(0, (totalVisible - renderRange.end) * ITEM_HEIGHT);


  const maxPage = useMemo(() => getMaxPage(sortedUsersForDisplay), [sortedUsersForDisplay]);

  return (
    <section className="flex">
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`app-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <button
          className="sidebar-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
        <menu className="flex column m-clear p-clear">
          <p>{t("filter")}</p>
          <label className="badge m-small">
            <input
              type="checkbox"
              name="showNonFollowers"
              checked={state.filter.showNonFollowers}
              onChange={handleScanFilter}
            />
            &nbsp;{t("nonFollowers")}
          </label>
          <label className="badge m-small">
            <input
              type="checkbox"
              name="showFollowers"
              checked={state.filter.showFollowers}
              onChange={handleScanFilter}
            />
            &nbsp;{t("followers")}
          </label>
          <label className="badge m-small">
            <input
              type="checkbox"
              name="showVerified"
              checked={state.filter.showVerified}
              onChange={handleScanFilter}
            />
            &nbsp;{t("verified")}
          </label>
          <label className="badge m-small">
            <input
              type="checkbox"
              name="showPrivate"
              checked={state.filter.showPrivate}
              onChange={handleScanFilter}
            />
            &nbsp;{t("private")}
          </label>
          <label className="badge m-small">
            <input
              type="checkbox"
              name="showWithOutProfilePicture"
              checked={state.filter.showWithOutProfilePicture}
              onChange={handleScanFilter}
            />
            &nbsp;{t("withoutProfilePicture")}
          </label>
        </menu>
        <div className="sidebar-stats">
          <p>{t("displayed")}: {sortedUsersForDisplay.length}</p>
          <p>{t("total")}: {state.results.length}</p>
          <p className="whitelist-counter">
            <span className="whitelist-badge">★</span> {t("whitelistedCount")}: {state.whitelistedResults.length}
          </p>
        </div>
        {/* Scan controls */}
        <div className="controls">
          <button
            className="button-control button-pause"
            onClick={pauseScan}
          >
            {scanningPaused ? t("resume") : t("pause")}
          </button>
        </div>
        <div className="sidebar-pagination">
          <p>{t("pages")}</p>
          <div className="pagination-controls">
            <a
              onClick={() => {
                if (state.page - 1 > 0) {
                  setState({
                    ...state,
                    page: state.page - 1,
                  });
                }
              }}
              className="p-medium"
            >
              ❮
            </a>
            <span>
              {state.page}&nbsp;/&nbsp;{maxPage}
            </span>
            <a
              onClick={() => {
                if (state.page < maxPage) {
                  setState({
                    ...state,
                    page: state.page + 1,
                  });
                }
              }}
              className="p-medium"
            >
              ❯
            </a>
          </div>
        </div>
        <button
          className="unfollow"
          onClick={() => {
            if (!confirm(t("areYouSure"))) {
              return;
            }
            //TODO TEMP until types are properly fixed
            // @ts-ignore
            setState(prevState => {
              if (prevState.status !== "scanning") {
                return prevState;
              }
              if (prevState.selectedResults.length === 0) {
                alert(t("mustSelectAtLeastOne"));
                return prevState;
              }
              const newState: State = {
                ...prevState,
                status: "unfollowing",
                percentage: 0,
                unfollowLog: [],
                filter: {
                  showSucceeded: true,
                  showFailed: true,
                },
              };
              return newState;
            });
          }}
        >
          {t("unfollow")} ({state.selectedResults.length})
        </button>
      </aside>
      <article className="results-container">
        <nav className="tabs-container">
          <div
            className={`tab ${state.currentTab === "non_whitelisted" ? "tab-active" : ""}`}
            onClick={() => {
              if (state.currentTab === "non_whitelisted") {
                return;
              }
              setState({
                ...state,
                currentTab: "non_whitelisted",
                selectedResults: [],
              });
            }}
          >
            {t("nonWhitelisted")}
          </div>
          <div
            className={`tab ${state.currentTab === "whitelisted" ? "tab-active" : ""}`}
            onClick={() => {
              if (state.currentTab === "whitelisted") {
                return;
              }
              setState({
                ...state,
                currentTab: "whitelisted",
                selectedResults: [],
              });
            }}
          >
            {t("whitelisted")}
          </div>
        </nav>
        <div className="results-list" ref={listRef} onScroll={handleScroll}>
          <div style={{ paddingTop: paddingTop, paddingBottom: paddingBottom }}>
          {virtualItems.map((user, idx) => {
          const globalIndex = renderRange.start + idx;
          const prevUser = pageUsers[globalIndex - 1];
          const prevLetter = prevUser ? prevUser.username.substring(0, 1).toUpperCase() : "";
          const firstLetter = user.username.substring(0, 1).toUpperCase();
          const showLetter = firstLetter !== prevLetter;
          return (
            <React.Fragment key={user.id}>
              {showLetter && <div className="alphabet-character" key={`letter-${firstLetter}-${globalIndex}`}>{firstLetter}</div>}
              <label className="result-item">
                <div className="flex grow align-center">
                  <div
                    className="avatar-container"
                    onClick={e => {
                      // Prevent selecting result when trying to add to whitelist.
                      e.preventDefault();
                      e.stopPropagation();
                      let whitelistedResults: readonly UserNode[] = [];
                      switch (state.currentTab) {
                        case "non_whitelisted":
                          whitelistedResults = [...state.whitelistedResults, user];
                          break;

                        case "whitelisted":
                          whitelistedResults = state.whitelistedResults.filter(
                            result => result.id !== user.id,
                          );
                          break;

                        default:
                          assertUnreachable(state.currentTab);
                      }
                      localStorage.setItem(
                        WHITELISTED_RESULTS_STORAGE_KEY,
                        JSON.stringify(whitelistedResults),
                      );
                      setState({ ...state, whitelistedResults });
                    }}
                  >
                    <img
                      className="avatar"
                      alt={user.username}
                      src={user.profile_pic_url}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="avatar-icon-overlay-container">
                      {state.currentTab === "non_whitelisted" ? (
                        <UserCheckIcon />
                      ) : (
                        <UserUncheckIcon />
                      )}
                    </span>
                  </div>
                  <div className="flex column m-medium">
                    <a
                      className="fs-xlarge"
                      target="_blank"
                      href={`/${user.username}`}
                      rel="noreferrer"
                    >
                      {user.username}
                    </a>
                    <span className="fs-medium">{user.full_name}</span>
                  </div>
                  {user.is_verified && <div className="verified-badge">✔</div>}
                  {user.is_private && (
                    <div className="flex justify-center w-100">
                      <span className="private-indicator">Private</span>
                    </div>
                  )}
                </div>
                <input
                  className="account-checkbox"
                  type="checkbox"
                  checked={state.selectedResults.some(selected => selected.id === user.id)}
                  onChange={e => toggleUser(e.currentTarget.checked, user)}
                />
              </label>
            </React.Fragment>
          );
        })}
        </div>
        </div>
      </article>
    </section>
  );
};
