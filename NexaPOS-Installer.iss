[Setup]
AppName=Nexa POS
AppVersion=2.4.0
AppPublisher=Nexa POS Solutions
AppPublisherURL=https://nexapossystem.vercel.app/
AppSupportURL=https://nexapossystem.vercel.app/contact-admin
AppUpdatesURL=https://nexapossystem.vercel.app/download
DefaultDirName={pf}\Nexa POS
DefaultGroupName=Nexa POS
OutputDir=.\installer-output
OutputBaseFilename=NexaPOS-Setup
Compression=lzma2/ultra64
SolidCompression=yes
SetupIconFile=public\favicon.ico
UninstallDisplayIcon={app}\NexaPOS.exe

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Place your Electron packaged app files inside the "dist-electron" or "build" folder and point here.
Source: "release-build\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Nexa POS"; Filename: "{app}\NexaPOS.exe"
Name: "{group}\{cm:UninstallProgram,Nexa POS}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\Nexa POS"; Filename: "{app}\NexaPOS.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\NexaPOS.exe"; Description: "{cm:LaunchProgram,Nexa POS}"; Flags: nowait postinstall skipifsilent

[Code]
function InitializeSetup(): Boolean;
begin
  Result := True;
end;
