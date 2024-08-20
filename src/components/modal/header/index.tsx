import "./styles.scss"

export const ModalHeader = ({ title }: { title: string }) => {
  return (
    <div className="modal-header">
      <h1 className="displayFontH1">{title}</h1>
    </div>
  );
};
