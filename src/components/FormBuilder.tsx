import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { AnimatePresence, motion } from "motion/react";
import { FaCircleChevronRight } from "react-icons/fa6";
import { FaChevronCircleLeft } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { IoCopy } from "react-icons/io5";

import * as prettier from "prettier/standalone";
import * as htmlParser from "prettier/parser-html";

const FormBuilder = () => {
  const [isLabelRepeated, setIsLabelRepeated] = useState<boolean>(false);
  const [code, setCode] = useState("");
  const [isViewCodeClicked, setIsViewCodeClicked] = useState(false);
  const [isCopySuccess, setIsCopySuccess] = useState<boolean>(false);

  const {
    inputLabel,
    inputType,
    fields,
    setInputLabel,
    setInputType,
    setFields,
    resetForm,
  } = useStore();

  const options = [
    "text",
    "checkbox",
    "password",
    "date",
    "email",
    "file",
    "number",
    "range",
  ];

  const handleAddField = () => {
    if (inputLabel === "" || inputType === "") return;
    const isRepeated = fields.some(
      (eachField) => eachField.inputLabel === inputLabel
    );
    setIsLabelRepeated(isRepeated);
    setTimeout(() => {
      setIsLabelRepeated(false);
    }, 2000);
    if (isRepeated) return;
    setIsCopySuccess(false);
    setFields({ inputLabel, inputType });
    setInputLabel("");
    setInputType("");
  };

  const handleResetForm = () => {
    resetForm();
    setIsViewCodeClicked(false);
    setIsCopySuccess(false);
  };

  const generateField = () => {
    return (
      <form
        className="w-full flex flex-col flex-1 items-center justify-around gap-y-6"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {fields.map((eachField, index) => (
          <div
            key={index}
            className={`text-center  w-2/3 text-white flex gap-y-2  ${
              eachField.inputType === "checkbox"
                ? "flex-row-reverse justify-center items-center"
                : "flex-col items-center"
            }`}
          >
            <label htmlFor={eachField.inputLabel} className="self-start  ml-2">
              {eachField.inputLabel} :
            </label>
            <input
              id={eachField.inputLabel}
              type={eachField.inputType}
              placeholder={`Enter ${eachField.inputLabel}...`}
              className={`px-4 rounded-xl py-3  bg-white/70 text-black placeholder:text-black ${
                eachField.inputType === "checkbox" ? "w-auto" : "w-full"
              } outline-0 `}
            />
          </div>
        ))}
        <button className="bg-green-700  px-8 py-3 rounded-2xl" type="submit">
          Submit
        </button>
      </form>
    );
  };

  useEffect(() => {
    const getCode = async () => {
      const jsxCode = (
        <form
          className="w-full flex flex-col flex-1 items-center justify-around gap-y-6"
          onSubmit="YourFormHandler"
        >
          {fields.map((eachField, index) => (
            <div
              key={index}
              className={`text-center  w-2/3 text-white flex gap-y-2  ${
                eachField.inputType === "checkbox"
                  ? "flex-row-reverse justify-center items-center"
                  : "flex-col items-center"
              }`}
            >
              <label
                htmlFor={eachField.inputLabel}
                className="self-start  ml-2"
              >
                {eachField.inputLabel}
              </label>
              <input
                id={eachField.inputLabel}
                type={eachField.inputType}
                placeholder={`Enter ${eachField.inputLabel} :`}
                className={`px-4 rounded-xl py-3  bg-white/70 text-black placeholder:text-black ${
                  eachField.inputType === "checkbox" ? "w-auto" : "w-full"
                } outline-0 `}
              />
            </div>
          ))}
          <button className="bg-green-700  px-8 py-3 rounded-2xl" type="submit">
            Submit
          </button>
        </form>
      );
      const result = await prettier.format(
        `<form onSubmit={YourFormHandler}>${ReactDOMServer.renderToStaticMarkup(jsxCode)}</form>`,
        {
          parser: "html",
          plugins: [htmlParser],
          singleAttributePerLine: true,
        }
      );
      setCode(result);
    };
    getCode();
  }, [fields]);

  const handleViewCodeClick = () => {
    if (fields.length === 0) return;
    setIsViewCodeClicked((prev) => !prev);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopySuccess(true);
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-500 flex flex-col items-center py-10 gap-y-6 overflow-hidden  ">
      <div className="lg:w-2/3 xl:w-1/2 w-[90vw]  bg-slate-900 text-white rounded-2xl p-10 flex flex-col items-center gap-y-6 pl-10">
        <p className="text-2xl font-semibold">Form Builder : </p>
        <div className="w-full flex flex-col gap-y-4">
          <div className="text-center text-white flex flex-col gap-y-2 items-center">
            <label htmlFor="label" className="self-start ml-20">
              Enter label :
            </label>
            <input
              id="label"
              type="text"
              value={inputLabel}
              placeholder="Enter Label :"
              className="px-4 rounded-xl py-3 bg-black w-2/3 outline-0 "
              onChange={(e) => {
                console.log(e.target.value);
                setInputLabel(e.target.value);
              }}
            />
          </div>
          <div className="text-center text-white flex flex-col gap-y-2 items-center">
            <label htmlFor="type" className="self-start ml-20">
              Select InputType :
            </label>
            <select
              id="type"
              className="px-4 rounded-xl py-3 bg-black w-2/3 outline-0 "
              value={inputType}
              onChange={(e) => {
                setInputType(e.target.value);
              }}
            >
              <option value="">---Please choose a option---</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center w-full px-8">
          <button
            className="px-6 py-2 rounded-2xl bg-green-700"
            onClick={handleAddField}
          >
            Add Field
          </button>
          <button
            className="px-6 py-2 rounded-2xl bg-red-700"
            onClick={handleResetForm}
          >
            Reset Form
          </button>
        </div>
      </div>
      <div
        className={`lg:w-2/3 xl:w-1/2 flex-1  w-[90vw] flex flex-col bg-slate-900 text-white rounded-2xl p-10 items-center gap-y-6 transition-all relative duration-1000   ${
          isViewCodeClicked ? "overflow-y-auto" : "overflow-y-clip"
        }`}
      >
        <p className="text-xl font-semibold">Form Preview :</p>
        {fields.length > 0 ? (
          generateField()
        ) : (
          <div className="flex flex-col mt-30 gap-y-6">
            <p className=" text-xl text-center">No Fields Added Yet...</p>
            <p>You can view the code once the fields are added 😎</p>
          </div>
        )}
        <motion.div
          className={` bg-black min-h-full  absolute left-0 top-0  ${
            isViewCodeClicked ? "rounded-2xl h-auto" : " rounded-r-4xl h-full"
          } rounded-l-2xl flex flex-col cursor-pointer  `}
          initial={{ width: 40 }}
          animate={isViewCodeClicked ? { width: "100%" } : { width: 40 }}
          transition={{ duration: 1, type: "tween" }}
        >
          <AnimatePresence>
            {isViewCodeClicked && (
              <motion.div
                className="pr-20 pl-10 pt-16 pb-8 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <pre className="w-full text-wrap">{code}</pre>
                <motion.div
                  className={`absolute top-0 right-14 bg-blue-600 p-2 rounded rounded-b-xl `}
                  onClick={handleCopyCode}
                  transition={{ duration: 0.5 }}
                >
                  {isCopySuccess ? (
                    <span className="">✅</span>
                  ) : (
                    <IoCopy color="black" size={22} />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            className={`absolute right-0 h-full flex items-center justify-center bg-teal-700 w-11  ${
              isViewCodeClicked
                ? "rounded-l-4xl rounded-r-2xl "
                : "rounded-l-2xl rounded-r-4xl "
            }
               `}
            onClick={handleViewCodeClick}
          >
            {isViewCodeClicked ? (
              <FaChevronCircleLeft size={30} color="black" />
            ) : (
              <FaCircleChevronRight size={30} color="black" />
            )}
          </div>
        </motion.div>
      </div>
      {isLabelRepeated && (
        <div className="absolute right-4 bottom-4 px-6 py-4 rounded-3xl bg-slate-900 text-white">
          The Lable "{inputLabel}" has been already used for the field
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
