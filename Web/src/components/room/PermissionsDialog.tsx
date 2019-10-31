import React from 'react';
import Modal from 'components/common/Modal';

interface PermissionsDialogType {
  isVisible: boolean;
  onConfirm: () => Promise<void>;
}

const PermissionsDialog: React.FC<PermissionsDialogType> = ({
  isVisible, onConfirm
}) => (
    <Modal
      isVisible={isVisible}
      title="Give Permissions?"
      onConfirm={onConfirm}
      confirmationButtonText="Sure!"
    >
      Pinda requires some device permissions in order to play some games.
    </Modal>
  );

export default PermissionsDialog;
