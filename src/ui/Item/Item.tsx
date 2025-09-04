"use client";

import { useState, Fragment } from "react";
import "./Item.css";

type ItemProps = {
  content: string;
  isDone: boolean;
  onContentChange: (content: string) => void;
  onIsDoneChange: (isDone: boolean) => void;
  onDelete?: () => void;
  onEdit: () => void;
};

export const Item = ({
  content,
  isDone,
  onContentChange,
  onIsDoneChange,
  onDelete,
  onEdit,
}: ItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const contentIsDoneClass = isDone ? " item__content--done" : "";
  const itemIsDoneClass = isDone ? " item--done" : "";

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.();
  };
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit();
    setIsEditing(false);
  };
  const toggleEditMode = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <div className={`item${itemIsDoneClass}`} onClick={(e) => onIsDoneChange(!isDone)}>
      {isEditing ? (
        <Fragment>
          <input
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="item__input"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="item__button--edit" aria-label="save changes" onClick={handleEdit}>
            oi
          </button>
        </Fragment>
      ) : (
        <div className="item__container">
          <div className="item__checkbox">
            {isDone && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="9"
                viewBox="0 0 15 9"
                fill="none"
              >
                <g clip-path="url(#clip0_946_493)">
                  <path
                    d="M14.2857 0.692261L6.42857 8.30765L2.85714 4.84611"
                    stroke="#9381FF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_946_493">
                    <rect width="15" height="9" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            )}
          </div>
          <p className={`item__content${contentIsDoneClass}`}>{content}</p>

          <button className="item__button" aria-label="edit" onClick={toggleEditMode}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <g clip-path="url(#clip0_946_510)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1.54159 3.04159C1.92839 2.6548 2.45299 2.4375 3 2.4375H8.25C8.56066 2.4375 8.8125 2.68934 8.8125 3C8.8125 3.31066 8.56066 3.5625 8.25 3.5625H3C2.75136 3.5625 2.5129 3.66127 2.33709 3.83709C2.16127 4.0129 2.0625 4.25136 2.0625 4.5V15C2.0625 15.2486 2.16127 15.4871 2.33709 15.6629C2.5129 15.8387 2.75136 15.9375 3 15.9375H13.5C13.7486 15.9375 13.9871 15.8387 14.1629 15.6629C14.3387 15.4871 14.4375 15.2486 14.4375 15V9.75C14.4375 9.43934 14.6893 9.1875 15 9.1875C15.3107 9.1875 15.5625 9.43934 15.5625 9.75V15C15.5625 15.547 15.3452 16.0716 14.9584 16.4584C14.5716 16.8452 14.047 17.0625 13.5 17.0625H3C2.45299 17.0625 1.92839 16.8452 1.54159 16.4584C1.1548 16.0716 0.9375 15.547 0.9375 15V4.5C0.9375 3.95299 1.1548 3.42839 1.54159 3.04159Z"
                  fill="#282846"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15 1.97156C14.7272 1.97156 14.4656 2.07992 14.2728 2.2728L7.25793 9.28763L6.77309 11.227L8.71243 10.7421L15.7273 3.7273C15.9201 3.53442 16.0285 3.27282 16.0285 3.00005C16.0285 2.72728 15.9201 2.46568 15.7273 2.2728C15.5344 2.07992 15.2728 1.97156 15 1.97156ZM13.4773 1.4773C13.8811 1.07344 14.4289 0.846558 15 0.846558C15.5712 0.846558 16.1189 1.07344 16.5228 1.4773C16.9266 1.88116 17.1535 2.42891 17.1535 3.00005C17.1535 3.57119 16.9266 4.11894 16.5228 4.5228L9.39776 11.6478C9.32567 11.7199 9.23534 11.771 9.13644 11.7958L6.13644 12.5458C5.94475 12.5937 5.74198 12.5375 5.60226 12.3978C5.46255 12.2581 5.40639 12.0553 5.45431 11.8636L6.20431 8.86362C6.22903 8.76472 6.28017 8.67439 6.35226 8.6023L13.4773 1.4773Z"
                  fill="#282846"
                />
              </g>
              <defs>
                <clipPath id="clip0_946_510">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>

          {onDelete && (
            <button className="item__button" aria-label="delete" onClick={handleDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1.6875 4.5C1.6875 4.18934 1.93934 3.9375 2.25 3.9375H15.75C16.0607 3.9375 16.3125 4.18934 16.3125 4.5C16.3125 4.81066 16.0607 5.0625 15.75 5.0625H2.25C1.93934 5.0625 1.6875 4.81066 1.6875 4.5Z"
                  fill="#F05454"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.5 2.0625C7.25136 2.0625 7.0129 2.16127 6.83709 2.33709C6.66127 2.5129 6.5625 2.75136 6.5625 3V3.9375H11.4375V3C11.4375 2.75136 11.3387 2.5129 11.1629 2.33709C10.9871 2.16127 10.7486 2.0625 10.5 2.0625H7.5ZM12.5625 3.9375V3C12.5625 2.45299 12.3452 1.92839 11.9584 1.54159C11.5716 1.1548 11.047 0.9375 10.5 0.9375H7.5C6.95299 0.9375 6.42839 1.1548 6.04159 1.54159C5.6548 1.92839 5.4375 2.45299 5.4375 3V3.9375H3.75C3.43934 3.9375 3.1875 4.18934 3.1875 4.5V15C3.1875 15.547 3.4048 16.0716 3.79159 16.4584C4.17839 16.8452 4.70299 17.0625 5.25 17.0625H12.75C13.297 17.0625 13.8216 16.8452 14.2084 16.4584C14.5952 16.0716 14.8125 15.547 14.8125 15V4.5C14.8125 4.18934 14.5607 3.9375 14.25 3.9375H12.5625ZM4.3125 5.0625V15C4.3125 15.2486 4.41127 15.4871 4.58709 15.6629C4.7629 15.8387 5.00136 15.9375 5.25 15.9375H12.75C12.9986 15.9375 13.2371 15.8387 13.4129 15.6629C13.5887 15.4871 13.6875 15.2486 13.6875 15V5.0625H4.3125Z"
                  fill="#F05454"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
