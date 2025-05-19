import cv2
import os

# المسار للفولدر اللي فيه الفيديوهات
video_folder = "assets/videos"
# المسار وين باش نخرّجو الصور المصغّرة
thumbnail_folder = "thumbnails"

# نتاكدو اللي الفولدر متاع الصور المصغّرة موجود
os.makedirs(thumbnail_folder, exist_ok=True)

# نعملو Loop على كل فيديو في الفولدر
for filename in os.listdir(video_folder):
    if filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
        video_path = os.path.join(video_folder, filename)
        thumbnail_path = os.path.join(thumbnail_folder, f"{os.path.splitext("about-thumbnail")[0]}.jpg")

        # نحلّ الفيديو
        cap = cv2.VideoCapture(video_path)

        if cap.isOpened():
            # نمشي للفريم رقم 100 (مثال)، تنجم تبدّل الرقم
            cap.set(cv2.CAP_PROP_POS_FRAMES, 100)
            success, frame = cap.read()
            if success:
                # نكتب الصورة في الفولدر
                cv2.imwrite(thumbnail_path, frame)
                print(f"[✓] Thumbnail saved for {filename}")
            else:
                print(f"[!] Failed to read frame for {filename}")
        else:
            print(f"[!] Failed to open video {filename}")

        cap.release()
