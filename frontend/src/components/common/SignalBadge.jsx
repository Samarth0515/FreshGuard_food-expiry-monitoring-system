import React from "react";
import { getExpiryStatus } from "../../utils/expiryUtils";

export default function SignalBadge({ expDate }) {
  const status = getExpiryStatus(expDate);
  return <span className={`signal signal-${status}`} title={status} />;
}
