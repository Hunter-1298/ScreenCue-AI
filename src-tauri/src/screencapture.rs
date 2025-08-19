use xcap::{
    image::{ImageBuffer, Rgba},
    Monitor,
};
pub fn capture_screen() -> Option<Vec<ImageBuffer<Rgba<u8>, Vec<u8>>>> {
    // Try to get all monitors; return None if it fails
    let monitors = Monitor::all().ok()?;
    // Collect images, skipping any failed captures
    let images: Vec<_> = monitors
        .into_iter()
        .filter_map(|monitor| monitor.capture_image().ok())
        .collect();
    if images.is_empty() {
        None
    } else {
        Some(images)
    }
}
