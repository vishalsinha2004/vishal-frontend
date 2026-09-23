export const virtualFileSystem = {
  "C:": {
    type: "dir",
    name: "Local Disk (C:)",
    contents: {
      "VISHAL": {
        type: "dir",
        name: "VISHAL",
        contents: {
          "ABOUT.TXT": { type: "file", size: 1024, date: "10-23-98", time: "11:38 PM", appId: "about-us" },
          "CONTACT.TXT": { type: "file", size: 512, date: "10-23-98", time: "11:38 PM", appId: null },
          "RESUME.PDF": { type: "file", size: 245128, date: "10-23-98", time: "11:38 PM", appId: "resume" }
        }
      },
      "PROJECTS": {
        type: "dir",
        name: "PROJECTS",
        contents: {
          // Dynamic projects will be merged here later
        }
      },
      "GAMES": {
        type: "dir",
        name: "GAMES",
        contents: {
          "TIC_TAC.EXE": { type: "file", size: 1048576, date: "10-23-98", time: "11:38 PM", appId: "tic-tac-toe" },
          "PROB_SOLV.EXE": { type: "file", size: 5048576, date: "10-23-98", time: "11:38 PM", appId: "problem-solver" }
        }
      },
      "WINDOWS": {
        type: "dir",
        name: "WINDOWS",
        contents: {
          "SYSTEM": {
            type: "dir",
            name: "SYSTEM",
            contents: {
              "SYS_OS.EXE": { type: "file", size: 4096, date: "10-23-98", time: "11:38 PM", appId: "system-os" }
            }
          },
          "COMMAND.COM": { type: "file", size: 93890, date: "05-11-98", time: "08:01 PM", appId: "problem-solver" },
          "CONTROL.EXE": { type: "file", size: 14336, date: "05-11-98", time: "08:01 PM", appId: "settings" }
        }
      }
    }
  }
};

// Helper to resolve a path string like "C:\VISHAL" to the actual object node
export const resolvePath = (pathStr) => {
  const parts = pathStr.split('\\').filter(Boolean);
  let current = virtualFileSystem;
  
  for (const part of parts) {
    if (current[part] && current[part].type === 'dir') {
      current = current[part].contents;
    } else if (current.contents && current.contents[part]) {
      // Handles moving into a nested directory structure properly
      current = current.contents[part];
    } else {
      return null; // Path invalid
    }
  }
  return current;
};