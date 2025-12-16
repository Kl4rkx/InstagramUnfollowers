import React, { useRef, useState } from "react";
import { UserNode } from "../model/user";
import { exportWhitelist, importWhitelist, clearWhitelist, mergeWhitelists } from "../utils/whitelist-manager";
import { TranslationKey } from "../constants/translations";

interface WhitelistManagerProps {
  whitelistedUsers: readonly UserNode[];
  onWhitelistUpdate: (users: readonly UserNode[]) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

export const WhitelistManager = ({ whitelistedUsers, onWhitelistUpdate, t }: WhitelistManagerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<"replace" | "merge">("merge");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleExport = () => {
    exportWhitelist(whitelistedUsers);
    setMessage({ type: "success", text: t("exported", { count: whitelistedUsers.length }) });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    importWhitelist(
      file,
      (importedUsers) => {
        let finalUsers: readonly UserNode[];
        
        if (importMode === "merge") {
          finalUsers = mergeWhitelists(whitelistedUsers, importedUsers);
          const newUsersCount = finalUsers.length - whitelistedUsers.length;
          setMessage({ 
            type: "success", 
            text: t("mergedSuccessfully", { 
              newUsersCount, 
              importedCount: importedUsers.length, 
              duplicatesCount: importedUsers.length - newUsersCount 
            })
          });
        } else {
          finalUsers = importedUsers;
          setMessage({ 
            type: "success", 
            text: t("replacedWhitelist", { count: importedUsers.length })
          });
        }
        
        onWhitelistUpdate(finalUsers);
        setTimeout(() => setMessage(null), 5000);
      },
      (errorMessage) => {
        setMessage({ type: "error", text: errorMessage });
        setTimeout(() => setMessage(null), 5000);
      }
    );

    // Reset file input
    event.currentTarget.value = "";
  };

  const handleClear = () => {
    clearWhitelist();
    onWhitelistUpdate([]);
    setMessage({ type: "success", text: t("whitelistCleared") });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="whitelist-manager">
      <div className="whitelist-header">
        <h4>{t("whitelistManagement")}</h4>
        <span className="whitelist-count">
          {whitelistedUsers.length} {whitelistedUsers.length === 1 ? t("user") : t("users")}
        </span>
      </div>

      {message && (
        <div className={`whitelist-message ${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      <div className="whitelist-actions">
        <button 
          className="btn btn-export" 
          onClick={handleExport}
          disabled={whitelistedUsers.length === 0}
          title={whitelistedUsers.length === 0 ? t("noUsersToExport") : t("exportWhitelistTooltip")}
        >
          📥 {t("exportWhitelist")}
        </button>

        <div className="import-section">
          <div className="import-mode">
            <label>
              <input
                type="radio"
                name="importMode"
                value="merge"
                checked={importMode === "merge"}
                onChange={() => setImportMode("merge")}
              />
              {t("merge")}
            </label>
            <label>
              <input
                type="radio"
                name="importMode"
                value="replace"
                checked={importMode === "replace"}
                onChange={() => setImportMode("replace")}
              />
              {t("replace")}
            </label>
          </div>

          <button 
            className="btn btn-import" 
            onClick={handleImportClick}
            title={t("importWhitelistTooltip")}
          >
            📤 {t("importWhitelist")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <button 
          className="btn btn-clear" 
          onClick={handleClear}
          disabled={whitelistedUsers.length === 0}
          title={whitelistedUsers.length === 0 ? t("whitelistEmpty") : t("clearWhitelistTooltip")}
        >
          🗑️ {t("clearWhitelist")}
        </button>
      </div>

      <div className="whitelist-info">
        <p className="info-text">
          <strong>💡 {t("tip")}:</strong> {t("whitelistTip")}
        </p>
      </div>
    </div>
  );
};
