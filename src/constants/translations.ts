export type Language = "en" | "es";

export const LANGUAGE_STORAGE_KEY = "iu_language";

export const translations = {
  en: {
    // Header & Actions
    toggleMenu: "Toggle menu",
    goBackToInstagram: "Go back to Instagram?",
    copyList: "Copy List",
    search: "Search...",
    selectPage: "Select page",
    selectAll: "Select all",
    
    // Tabs
    nonWhitelisted: "Non-Whitelisted",
    whitelisted: "Whitelisted",
    
    // Sidebar - Filter
    filter: "Filter",
    nonFollowers: "Non-Followers",
    followers: "Followers",
    verified: "Verified",
    private: "Private",
    withoutProfilePicture: "Without Profile Picture",
    
    // Sidebar - Stats
    displayed: "Displayed",
    total: "Total",
    whitelistedCount: "Whitelisted",
    
    // Sidebar - Controls
    pause: "Pause",
    resume: "Resume",
    pages: "Pages",
    
    // Buttons
    run: "RUN",
    unfollow: "UNFOLLOW",
    cancel: "Cancel",
    save: "Save",
    
    // Unfollow Process
    areYouSure: "Are you sure?",
    mustSelectAtLeastOne: "Must select at least a single user to unfollow",
    unfollowed: "Unfollowed",
    failedToUnfollow: "Failed to unfollow",
    allDone: "All DONE!",
    
    // Unfollow Filter
    succeeded: "Succeeded",
    failed: "Failed",
    
    // Toast Messages
    scanningCompleted: "Scanning completed!",
    sleepingToPreventBlock: "Sleeping {seconds} seconds to prevent getting temp blocked",
    sleepingMinutesToPreventBlock: "Sleeping {minutes} minutes to prevent getting temp blocked",
    listCopiedToClipboard: "List copied to clipboard!",
    
    // Settings
    settings: "Settings",
    defaultTimeBetweenSearchCycles: "Default time between search cycles",
    defaultTimeAfterFiveSearchCycles: "Default time to wait after five search cycles",
    defaultTimeBetweenUnfollows: "Default time between unfollows",
    defaultTimeAfterFiveUnfollows: "Default time to wait after five unfollows",
    warningTitle: "WARNING:",
    warningMessage: "Modifying these settings can lead to your account being banned.",
    warningDisclaimer: "USE IT AT YOUR OWN RISK!!!!",
    
    // Whitelist Manager
    whitelistManagement: "Whitelist Management",
    users: "users",
    user: "user",
    exportWhitelist: "Export Whitelist",
    importWhitelist: "Import Whitelist",
    clearWhitelist: "Clear Whitelist",
    merge: "Merge (add to existing)",
    replace: "Replace (overwrite)",
    noUsersToExport: "No users in whitelist to export",
    exportWhitelistTooltip: "Export whitelist to JSON file",
    importWhitelistTooltip: "Import whitelist from JSON file",
    whitelistEmpty: "Whitelist is empty",
    clearWhitelistTooltip: "Clear all whitelist data",
    whitelistIsEmpty: "Whitelist is empty",
    clearWhitelistConfirm: "Are you sure you want to clear the entire whitelist? This action cannot be undone.",
    exported: "Exported {count} users successfully",
    mergedSuccessfully: "Merged successfully! Added {newUsersCount} new users ({importedCount} imported, {duplicatesCount} duplicates skipped)",
    merged: "Merged successfully! Added {new} new users ({imported} imported, {duplicates} duplicates skipped)",
    replacedWhitelist: "Replaced whitelist with {count} users",
    replaced: "Replaced whitelist with {count} users",
    whitelistCleared: "Whitelist cleared successfully",
    invalidFileFormat: "Invalid file format: Expected an array of users",
    invalidUserFields: "Invalid file format: Users missing required fields (id, username)",
    failedToParse: "Failed to parse JSON file: {error}",
    failedToRead: "Failed to read file",
    whitelistTip: "Export your whitelist to save it as a backup. You can import it later to restore your saved users.",
    tip: "Tip",
    
    // Language
    language: "Language",
    english: "English",
    spanish: "Spanish (Spain)",
  },
  es: {
    // Header & Actions
    toggleMenu: "Alternar menú",
    goBackToInstagram: "¿Volver a Instagram?",
    copyList: "Copiar Lista",
    search: "Buscar...",
    selectPage: "Seleccionar página",
    selectAll: "Seleccionar todo",
    
    // Tabs
    nonWhitelisted: "No en Lista Blanca",
    whitelisted: "En Lista Blanca",
    
    // Sidebar - Filter
    filter: "Filtrar",
    nonFollowers: "No Seguidores",
    followers: "Seguidores",
    verified: "Verificados",
    private: "Privados",
    withoutProfilePicture: "Sin Foto de Perfil",
    
    // Sidebar - Stats
    displayed: "Mostrados",
    total: "Total",
    whitelistedCount: "En Lista Blanca",
    
    // Sidebar - Controls
    pause: "Pausar",
    resume: "Reanudar",
    pages: "Páginas",
    
    // Buttons
    run: "INICIAR",
    unfollow: "DEJAR DE SEGUIR",
    cancel: "Cancelar",
    save: "Guardar",
    
    // Unfollow Process
    areYouSure: "¿Estás seguro?",
    mustSelectAtLeastOne: "Debes seleccionar al menos un usuario para dejar de seguir",
    unfollowed: "Dejaste de seguir a",
    failedToUnfollow: "Error al dejar de seguir a",
    allDone: "¡TODO LISTO!",
    
    // Unfollow Filter
    succeeded: "Exitosos",
    failed: "Fallidos",
    
    // Toast Messages
    scanningCompleted: "¡Escaneo completado!",
    sleepingToPreventBlock: "Esperando {seconds} segundos para evitar bloqueo temporal",
    sleepingMinutesToPreventBlock: "Esperando {minutes} minutos para evitar bloqueo temporal",
    listCopiedToClipboard: "¡Lista copiada al portapapeles!",
    
    // Settings
    settings: "Configuración",
    defaultTimeBetweenSearchCycles: "Tiempo predeterminado entre ciclos de búsqueda",
    defaultTimeAfterFiveSearchCycles: "Tiempo de espera predeterminado después de cinco ciclos de búsqueda",
    defaultTimeBetweenUnfollows: "Tiempo predeterminado entre dejar de seguir",
    defaultTimeAfterFiveUnfollows: "Tiempo de espera predeterminado después de cinco veces dejar de seguir",
    warningTitle: "ADVERTENCIA:",
    warningMessage: "Modificar estas configuraciones puede llevar a que tu cuenta sea baneada.",
    warningDisclaimer: "¡¡¡ÚSALO BAJO TU PROPIO RIESGO!!!",
    
    // Whitelist Manager
    whitelistManagement: "Gestión de Lista Blanca",
    users: "usuarios",
    user: "usuario",
    exportWhitelist: "Exportar Lista Blanca",
    importWhitelist: "Importar Lista Blanca",
    clearWhitelist: "Limpiar Lista Blanca",
    merge: "Combinar (agregar a la existente)",
    replace: "Reemplazar (sobrescribir)",
    noUsersToExport: "No hay usuarios en la lista blanca para exportar",
    exportWhitelistTooltip: "Exportar lista blanca a archivo JSON",
    importWhitelistTooltip: "Importar lista blanca desde archivo JSON",
    whitelistEmpty: "La lista blanca está vacía",
    clearWhitelistTooltip: "Limpiar todos los datos de la lista blanca",
    whitelistIsEmpty: "La lista blanca está vacía",
    clearWhitelistConfirm: "¿Estás seguro de que quieres limpiar toda la lista blanca? Esta acción no se puede deshacer.",
    exported: "Se exportaron {count} usuarios exitosamente",
    mergedSuccessfully: "¡Combinado exitosamente! Se agregaron {newUsersCount} usuarios nuevos ({importedCount} importados, {duplicatesCount} duplicados omitidos)",
    merged: "¡Combinado exitosamente! Se agregaron {new} usuarios nuevos ({imported} importados, {duplicates} duplicados omitidos)",
    replacedWhitelist: "Lista blanca reemplazada con {count} usuarios",
    replaced: "Lista blanca reemplazada con {count} usuarios",
    whitelistCleared: "Lista blanca limpiada exitosamente",
    invalidFileFormat: "Formato de archivo inválido: Se esperaba un array de usuarios",
    invalidUserFields: "Formato de archivo inválido: A los usuarios les faltan campos requeridos (id, username)",
    failedToParse: "Error al analizar el archivo JSON: {error}",
    failedToRead: "Error al leer el archivo",
    whitelistTip: "Exporta tu lista blanca para guardarla como respaldo. Puedes importarla más tarde para restaurar tus usuarios guardados.",
    tip: "Consejo",
    
    // Language
    language: "Idioma",
    english: "Inglés",
    spanish: "Español (España)",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
