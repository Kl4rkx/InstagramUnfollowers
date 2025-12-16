import React, { ChangeEvent, useState } from "react";
import { State } from "../model/state";
import { assertUnreachable, copyListToClipboard, getCurrentPageUnfollowers, getUsersForDisplay } from "../utils/utils";
import { SettingMenu } from "./SettingMenu";
import { SettingIcon } from "./icons/SettingIcon";
import { Timings } from "../model/timings";
import { Logo } from "./icons/Logo";
import { UserNode } from "../model/user";
import { Language, TranslationKey } from "../constants/translations";
import { LanguageSelector } from "./LanguageSelector";

interface ToolBarProps {
  isActiveProcess: boolean;
  state: State;
  setState: (state: State) => void;
  toggleAllUsers: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleCurrentePageUsers: (e: ChangeEvent<HTMLInputElement>) => void;
  currentTimings: Timings;
  setTimings: (timings: Timings) => void;
  whitelistedUsers: readonly UserNode[];
  onWhitelistUpdate: (users: readonly UserNode[]) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

export const Toolbar = ({
  isActiveProcess,
  state,
  setState,
  toggleAllUsers,
  toggleCurrentePageUsers,
  currentTimings,
  setTimings,
  whitelistedUsers,
  onWhitelistUpdate,
  sidebarOpen,
  setSidebarOpen,
  language,
  setLanguage,
  t,
}: ToolBarProps) => {

  const [setingMenu, setSettingMenu] = useState(false);

  return (
    <header className="app-header">
      {isActiveProcess && (
        <progress
          className="progressbar"
          value={state.status !== "initial" ? state.percentage : 0}
          max="100"
        />
      )}
      <div className="app-header-content">
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={t("toggleMenu")}
          aria-label={t("toggleMenu")}
        >
          ☰
        </button>
        <div
          className="logo"
          onClick={() => {
            if (isActiveProcess) {
              // Avoid resetting state while active process.
              return;
            }
            switch (state.status) {
              case "initial":
                if (confirm(t("goBackToInstagram"))) {
                  location.reload();
                }
                break;

              case "scanning":
              case "unfollowing":
                setState({
                  status: "initial",
                });
            }
          }}
        >
          <Logo />
          <div className="logo-text">
            <span>Enhanced</span>
            <span>Instagram</span>
            <span>Unfollowers</span>
          </div>
        </div>
        <div className="header-actions">
        <button
          className="copy-list"
          onClick={() => {
            switch (state.status) {
              case "scanning":
                return copyListToClipboard(
                  getUsersForDisplay(
                    state.results,
                    state.whitelistedResults,
                    state.currentTab,
                    state.searchTerm,
                    state.filter,
                  ),
                );
              case "initial":
              case "unfollowing":
                return;
              default:
                assertUnreachable(state);
            }
          }}
          disabled={state.status === "initial"}
        >
          {t("copyList")}
        </button>
        {
          state.status === "initial" && <SettingIcon onClickLogo={() => { setSettingMenu(true); }} />
        }
        <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
        <input
          type="text"
          className="search-bar"
          placeholder={t("search")}
          disabled={state.status === "initial"}
          value={state.status === "initial" ? "" : state.searchTerm}
          onChange={e => {
            switch (state.status) {
              case "initial":
                return;
              case "scanning":
                return setState({
                  ...state,
                  searchTerm: e.currentTarget.value,
                });
              case "unfollowing":
                return setState({
                  ...state,
                  searchTerm: e.currentTarget.value,
                });
              default:
                assertUnreachable(state);
            }
          }}
        />
        {state.status === "scanning" && (
          <label
            className="select-control"
            title="Seleccionar esta página / Select this page"
          >
            <input
              type="checkbox"
              // Avoid allowing to select all before scan completed to avoid confusion
              // regarding what exactly is selected while scanning in progress.
              disabled={state.percentage < 100}
              checked={
                (() => {
                  const displayed = getUsersForDisplay(state.results, state.whitelistedResults, state.currentTab, state.searchTerm, state.filter);
                  const pageUsers = getCurrentPageUnfollowers(displayed, state.page);
                  // Fix: Check if pageUsers is not empty and all are selected
                  // Previous logic didn't account for empty page or partial selections correctly
                  return pageUsers.length > 0 && pageUsers.every(u => state.selectedResults.some(s => s.id === u.id));
                })()
              }
              className="toggle-all-checkbox"
              // Fix: Changed from onClick to onChange for proper React checkbox handling
              // onClick doesn't trigger reliably for controlled checkboxes
              onChange={toggleCurrentePageUsers}
            />
            <span className="select-control__label">
              {t("selectPage")}
            </span>
          </label>
        )}
        {state.status === "scanning" && (
          <label
            className="select-control"
            title="Seleccionar todo / Select all"
          >
            <input
              type="checkbox"
              // Avoid allowing to select all before scan completed to avoid confusion
              // regarding what exactly is selected while scanning in progress.
              disabled={state.percentage < 100}
              checked={
                state.selectedResults.length ===
                getUsersForDisplay(
                  state.results,
                  state.whitelistedResults,
                  state.currentTab,
                  state.searchTerm,
                  state.filter,
                ).length
              }
              className="toggle-all-checkbox"
              // Fix: Changed from onClick to onChange for proper React checkbox handling
              // onClick doesn't trigger reliably for controlled checkboxes
              onChange={toggleAllUsers}
            />
            <span className="select-control__label">
              {t("selectAll")}
            </span>
          </label>
        )}
        </div>
      </div>
      {(setingMenu) &&
        <SettingMenu
          setSettingState={setSettingMenu}
          currentTimings={currentTimings}
          setTimings={setTimings}
          whitelistedUsers={whitelistedUsers}
          onWhitelistUpdate={onWhitelistUpdate}
        ></SettingMenu>
      }

    </header>
  );
};
