import type { BrowserWindow, IpcMainInvokeEvent } from 'electron'
import { PropsWithChildren } from "react";


export type BrowserWindowOrNull = Electron.BrowserWindow | null





export interface WindowCreationByIPC {
  channel: string
  window(): BrowserWindowOrNull
  callback(window: BrowserWindow, event: IpcMainInvokeEvent): void
}




export interface ModalProps extends PropsWithChildren {
  open?: boolean;
  setOpen: (v: boolean) => void;
}