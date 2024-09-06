"use client";
import Image from "next/image";
import "./photo.scss";
import { ChangeEvent, FC, useContext, useState } from "react";
import { MAX_UPLOAD_SIZE } from "@/lib/constants";
import { updatePhoto } from "@/actions/updatePhoto";
import { LoadingModal } from "@/components/modal/loading";
import { useTranslations } from "next-intl";
import { NotificationsContext } from "@/components/notifications";
import { NotificationTypes } from "@/components/notifications/reducer";

interface Props {
  userId: string;
}

export const EditPhoto: FC<Props> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("EditPhoto");
  const context = useContext(NotificationsContext);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (image) {
      const size = image.size;

      if (size < MAX_UPLOAD_SIZE) {
        let reader = new FileReader();
        reader.readAsDataURL(image);

        reader.onload = async function () {
          if (reader.result) {
            setIsLoading(true);
            updatePhoto(reader.result as string, userId).then(() => {
              setIsLoading(false);
              context.pushNotification(t("success"), NotificationTypes.SUCCESS);
            });
            // we need to update session, or tag, to trigger the header rerender
            // session.update({ image: reader.result });
          }
        };

        reader.onerror = function (error) {
          console.error(error);
          context.pushNotification(t("error-reading"), NotificationTypes.ERROR);
        };
      } else {
        context.pushNotification(t("limit"), NotificationTypes.ERROR);
      }
    }
  };

  return (
    <>
      <input
        type="file"
        id="photo-update"
        className="profile-card-img-upload-input"
        accept="image/png, image/jpeg, image/gif"
        onChange={onChange}
        multiple={false}
      />
      <label className="profile-card-img-upload" htmlFor="photo-update">
        <Image
          src="/image-upload.svg"
          width={25}
          height={25}
          alt="upload image"
        />
      </label>

      {isLoading && <LoadingModal />}
    </>
  );
};
