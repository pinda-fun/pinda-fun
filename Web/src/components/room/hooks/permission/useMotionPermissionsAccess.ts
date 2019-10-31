import { useState, useCallback } from 'react';
import { MotionPermission } from 'components/games/GameStates';

/** Wrapper for the permissions-related states and methods. */
export default () => {
  const [permission, setPermission] = useState(MotionPermission.NOT_SET);
  const [awaitingPermission, setAwaitingPermission] = useState(false);

  const getUserPermission = async () => {
    if (!awaitingPermission) return;
    try {
      const permissionResult = await (window.DeviceMotionEvent as any).requestPermission();
      if (permissionResult === 'granted') {
        setPermission(MotionPermission.GRANTED);
      } else {
        setPermission(MotionPermission.DENIED);
      }
    } catch (e) {
      setPermission(MotionPermission.DENIED);
    } finally {
      setAwaitingPermission(false);
    }
  };

  const getPermissionAvailability = useCallback(
    () => {
      if (!window.DeviceMotionEvent) {
        setPermission(MotionPermission.DENIED);
        return;
      }
      if (
        typeof (window.DeviceMotionEvent as any).requestPermission === 'function'
      ) {
        setAwaitingPermission(true);
      } else {
        setPermission(MotionPermission.GRANTED);
      }
    },
    [],
  );

  return {
    /** The current state of the permissions for the device motion. */
    permission,
    /** STATE TO OBSERVE to activate/deactivate request modal. */
    awaitingPermission,
    /** Method to call to check/request for permissions on user's phone. */
    getUserPermission,
    /** Method to check for permissions on user's phone, and updates permission if found. */
    getPermissionAvailability,
  };
};
