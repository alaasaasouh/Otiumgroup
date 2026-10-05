# Contact delivery

Inquiries are configured for `asonyxmedia@gmail.com` through the FormSubmit AJAX endpoint in `data/site.js`. The contact page also displays a direct email link. The subject includes the inquiry type, and the payload includes the visitor's language and page URL. The visitor's `email` field provides the reply-to address.

## Required activation

After publishing, submit an inquiry from the live contact page. Check the recipient inbox and spam folder for FormSubmit's activation email, then follow its confirmation link. Repeat if FormSubmit requests activation for the second hosting origin. Send another inquiry afterward to verify actual receipt. Browser checks use intercepted responses and do not establish inbox delivery or activation.

The form only shows success after an accepted service response. Activation and failure responses preserve entered fields and display the direct email link. French and Arabic messages are included. FormSubmit processes submitted details; its documentation says submissions are retained for 30 days.

Set `formEndpoint` to an empty string to restore the local downloadable-brief behavior. Run `node scripts/check-contact.cjs` against the local preview to test delivery behavior without sending messages.

Service references: [AJAX integration](https://formsubmit.co/ajax-documentation), [activation help](https://formsubmit.co/help), [field options and retention](https://formsubmit.co/documentation).
