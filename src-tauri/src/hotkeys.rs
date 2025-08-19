use crate::screencapture;
use anyhow::Result;
use tauri::{App, Manager};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

pub fn register(app: &mut App) -> Result<()> {
    #[cfg(desktop)]
    let ctrl_s_shortcut = Shortcut::new(Some(Modifiers::CONTROL), Code::KeyS);
    app.handle().plugin(
        tauri_plugin_global_shortcut::Builder::new()
            .with_handler(move |_app, shortcut, event| {
                if shortcut == &ctrl_s_shortcut && event.state() == ShortcutState::Pressed {
                    // Spawn a background thread for screen capture
                    let _app_handle = _app.clone();
                    std::thread::spawn(move || {
                        if let Some(screenshot) = screencapture::capture_screen() {
                            println!("Screenshot Captured, {} images", screenshot.len());
                            // You can now pass `screenshot` to your LLM here
                        }
                        if let Some(window) = _app_handle.get_webview_window("main") {
                            let visible = window.is_visible().unwrap_or(false);
                            if visible {
                                window.hide().unwrap();
                            } else {
                                window.show().unwrap();
                                window.set_focus().unwrap();
                            }
                        }
                    });
                }
            })
            .build(),
    )?;
    app.global_shortcut().register(ctrl_s_shortcut)?;
    Ok(())
}
