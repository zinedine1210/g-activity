import Image from 'next/image';
import { formatFileSize } from '@utils/function';

const AttachmentList = ({ attachments }) => {
  const getIconAndAlt = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    let icon, alt;

    switch (extension) {
      case 'pdf':
        icon = '/images/mail/attachment_pdf.svg';
        alt = 'attachment pdf';
        break;
      case 'doc':
      case 'docx':
        icon = '/images/mail/attachment_doc.svg';
        alt = 'attachment doc';
        break;
      case 'xls':
      case 'xlsx':
        icon = '/images/mail/attachment_excel.svg';
        alt = 'attachment excel';
        break;
      default:
        icon = '/images/mail/attachment_generic.svg';
        alt = 'attachment';
        break;
    }

    return { icon, alt };
  };

  return (
    <div className="flex space-x-4 py-4">
      {attachments.map((file, index) => {
        const { icon, alt } = getIconAndAlt(file.filename);
        return (
          <div
            key={index}
            className="w-70 flex items-center py-2.5 px-2 border-2 border-gray-300 rounded-lg hover:bg-gray-200"
          >
            <div className="flex items-center">
              <div className="w-10 flex items-center justify-center">
                <Image src={icon} alt={alt} width={50} height={50} />
              </div>
              <div className="w-48 ml-2 flex flex-col">
                <a href="#" className="text-sm text-gray-700 font-bold truncate">
                  {file.filename}
                </a>
                <span className="text-gray-500 text-xs"> {formatFileSize(file.size)}</span>
              </div>
            </div>
            <button
              className="w-6 flex items-center justify-center"
              title="Download"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-500 hover:text-gray-600 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentList;
