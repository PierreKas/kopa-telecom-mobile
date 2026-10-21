/** Both backend services wrap every error response the same way (their GlobalExceptionHandler
 *  always returns ApiResponse<Void> with an error, even on the customer-identity endpoints whose
 *  *success* body isn't wrapped — see registration/controller's plain DTOs vs auth/login's
 *  wrapped one). Success-body wrapping differs per endpoint; this type only covers the error
 *  shape, which is uniform. */
export interface ApiErrorBody {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
}

/** `ApiResponse<T>` wrapper shape — used by every customer-self-care endpoint and by
 *  customer-identity's /auth/login only. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
