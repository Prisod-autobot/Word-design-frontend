import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	InsertNewWords,
	InsertThaiWord,
	FetchNewData,
	insertTextTranslated,
	FetchTransSetData,
} from "../features/authSlice";
import { motion } from "framer-motion";

const ComboPage = () => {
	// Translate sentence
	const [selectedWords, setSelectedWords] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [transSentence, setTransSentence] = useState("");
	// Separate sentence
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");
	const [countSentences, setCountSentences] = useState([]);
	const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

	const [secondTextAreaContent, setSecondTextAreaContent] = useState("");
	// Add thai word
	const [inputThai, setInputThai] = useState([]);
	const [wordCount, setWordCount] = useState(0);

	// Insert sentences
	const dispatch = useDispatch();
	const arr_sentences = useSelector(state => state.auth.sentences);
	const tran_set = useSelector(state => state.auth.translatedSet);
	const tran_all = useSelector(state => state.auth.sentenceThai);

	//Real time xx
	const [transWordAll, setTransWordAll] = useState(tran_all.trans_all_word);
	const [transSetWordAll, setTransSetWordAll] = useState(tran_set);

	useEffect(() => {
		if (arr_sentences) {
			console.log(arr_sentences);
		}
		if (tran_set) {
			setTransSetWordAll(tran_set);
		}
		if (tran_all) {
			setTransWordAll(tran_all.trans_all_word);
		}
	}, [arr_sentences, tran_set, tran_all]);

	// Insert sentence
	const insertText = e => {
		e.preventDefault();
		setSelectedWords([]);
		setCurrentIndex(0);
		setTransSentence("");
		dispatch(InsertNewWords({ outputText }));
	};

	//Insert thai word
	const thaiWord = (event, index) => {
		event.preventDefault();
		const word_id = arr_sentences[index].word_id;

		try {
			dispatch(
				InsertThaiWord({
					inputThai: inputThai[index],
					engWordId: word_id,
				})
			);

			// Fetch updated data after successfully inserting Thai word
			dispatch(
				FetchNewData({
					arr_sentences: arr_sentences.map(sentence => sentence),
				})
			);

			dispatch(
				FetchTransSetData({
					arr_sentences: arr_sentences,
				})
			);
		} catch (error) {
			// Handle error if needed
			console.error("Error inserting Thai word:", error);
		}
	};

	const separateSentences = () => {
		const cleanText = inputText
			.split("\n")
			.filter(line => line.trim() !== "")
			.join(" newx ");
		const sentencesArray = cleanText.split(/(?<=[.!?])\s*/);
		const word_x_count = inputText.split(/\s+/);
		setWordCount(word_x_count.length);
		setCountSentences(sentencesArray);
		setOutputText(sentencesArray[0] || "");

		setCurrentSentenceIndex(0);
	};

	const showNextSentence = () => {
		if (currentSentenceIndex < countSentences.length - 1) {
			setCurrentSentenceIndex(currentSentenceIndex + 1);
			setOutputText(countSentences[currentSentenceIndex + 1]);
			setInputThai([]);
			setSelectedWords([]);
			setCurrentIndex(0);
			setTransSetWordAll("");
			setTransSentence("");
			dispatch(InsertNewWords({}));
		}
	};

	const showPreviousSentence = () => {
		if (currentSentenceIndex > 0) {
			setCurrentSentenceIndex(currentSentenceIndex - 1);
			setOutputText(countSentences[currentSentenceIndex - 1]);
			setInputThai([]);
			setSelectedWords([]);
			setCurrentIndex(0);
			setTransSetWordAll("");
			setTransSentence("");
			dispatch(InsertNewWords({}));
		}
	};

	// Select word function
	const selectWord = wordId => {
		const selectedWord = arr_sentences.find(
			word => word.word_id === wordId
		);

		if (currentIndex === 0) {
			setSelectedWords([selectedWord]);
		} else {
			setSelectedWords(prevSelectedWords => [
				...prevSelectedWords,
				selectedWord,
			]);
		}

		setCurrentIndex(prevIndex => prevIndex + 1);
	};

	const resetSelection = () => {
		setTransSetWordAll("");
		setSelectedWords([]);
		setCurrentIndex(0);
		setTransSentence("");
		dispatch(
			FetchTransSetData({
				arr_sentences: arr_sentences,
			})
		);
	};

	const textTranslated = e => {
		e.preventDefault();

		const wordOrder = selectedWords.map(word => word.word_id);
		const word_text = selectedWords.map(word => word.word);

		dispatch(
			insertTextTranslated({
				engSentence: word_text,
				wordOrder,
				transSentence: transSentence,
			})
		);

		dispatch(
			FetchTransSetData({
				arr_sentences: arr_sentences,
			})
		);
	};

	const sanitizeText = text => {
		const newText = (text || "").replace(/<br>/g, "\n");
		const finalText = newText.replace(/&ldquo;/g, '"');
		return finalText;
	};

	const pushToSecondTextArea = () => {
		setSecondTextAreaContent(
			prevContent => prevContent + transWordAll + "\n"
		);

		setTransWordAll("");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-black-white">
			<div className="w-full max-w-full flex justify-center items-start gap-4 m-4 font-mono tracking-wide	">
				<div className="w-1/2 sticky top-0 z-50">
					<div className="bg-white text-black p-4 h-screen rounded bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg">
						<p className="text-xl">Result filter.</p>
						<textarea
							value={sanitizeText(secondTextAreaContent)}
							onChange={e =>
								setSecondTextAreaContent(e.target.value)
							}
							className="w-full border-2 border-gray-300 bg-gray-200  h-full resize-none p-2 rounded-md focus:outline-none focus:border-blue-300"
							placeholder="Type here..."></textarea>
					</div>
				</div>
				<div className="w-1/2 flex flex-col gap-4">
					<div className="bg-white text-black p-4 rounded bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg">
						<p>All sentence</p>
						<textarea
							value={inputText}
							onChange={e => setInputText(e.target.value)}
							className="w-full border-2 border-gray-300 bg-gray-200 h-96 resize-none p-2 rounded-md focus:outline-none focus:border-blue-300"
							placeholder="Type here..."></textarea>
						<motion.button
							type="button"
							onClick={separateSentences}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
							&#10070; Generate
						</motion.button>
					</div>

					<div className="bg-white text-black p-4 rounded bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg">
						<div className="justify-between	flex">
							<p>This is separate sentence.</p>
							<p>
								{wordCount} words {currentSentenceIndex + 1}{" "}
								form {countSentences.length} sentence.
							</p>
						</div>
						<form onSubmit={insertText} className="mb-4">
							<textarea
								value={outputText}
								onChange={e => setOutputText(e.target.value)}
								readOnly
								className="w-full border-2 border-gray-300 bg-gray-200 h-32 resize-none p-2 rounded-md"
								placeholder="Type here..."></textarea>
							<motion.button
								type="button"
								onClick={showPreviousSentence}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-black  w-1/4 text-white font-bold py-2 px-4 rounded mr-2">
								&lsaquo; Previous
							</motion.button>
							<motion.button
								type="button"
								onClick={showNextSentence}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-black  w-1/4 text-white font-bold py-2 px-4 rounded mr-2">
								Next &rsaquo;
							</motion.button>
							<motion.button
								type="button"
								onClick={insertText}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
								&#10015; Analyze
							</motion.button>
						</form>

						<table className="w-full table-auto border-collapse">
							<thead>
								<tr>
									<th className="py-2 px-4 bg-white border-black text-black font-bold uppercase text-base border-t-2 border-b-2 border-r-2">
										EN
									</th>
									<th className="py-2 px-4 bg-white border-black text-black font-bold uppercase text-base border-t-2 border-b-2 border-l-2 ">
										TH
									</th>
									<th className="py-2 px-4 bg-white border-black text-black font-bold uppercase text-base border-t-2 border-b-2 border-l-2">
										Add
									</th>
									<th className="py-2 px-4 bg-white border-black text-black font-bold uppercase text-base border-t-2 border-b-2">
										ex.
									</th>
								</tr>
							</thead>
							<tbody>
								{arr_sentences &&
									arr_sentences.length > 0 &&
									arr_sentences.map((sentence, index) => (
										<tr
											key={`${sentence.word_id}_${index}`}>
											<td className="text-sm py-2 px-4 bg-white border-b-2 border-r-2  border-black">
												{sentence.word}
											</td>
											<td className="text-sm py-2 px-4 bg-white border-b-2 border-l-2 border-black">
												{sentence.meaning}
											</td>
											<td className="py-2 px-4 bg-white border-b-2 border-l-2  border-black">
												<input
													required
													value={
														inputThai[index] || ""
													}
													onChange={e =>
														setInputThai(
															prevInputThai => {
																const newInputThai =
																	[
																		...prevInputThai,
																	];
																newInputThai[
																	index
																] =
																	e.target.value;
																return newInputThai;
															}
														)
													}
													type="text"
													className="w-full border-2 border-black p-2 border-r-1 border-t-1 rounded-br-xl focus:outline-none focus:border-black"
													placeholder="Add here..."
												/>
											</td>
											<td className="py-2 px-px border-b-2 bg-white border-black">
												<motion.button
													type="button"
													onClick={e =>
														thaiWord(e, index)
													}
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
													className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
													&#9998; Submit
												</motion.button>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>

					<div className="bg-white text-black p-4 rounded bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg">
						<p>Selector.</p>
						<form
							onSubmit={textTranslated}
							className="grid grid-cols-3 items-center gap-4 mb-4">
							<input
								value={selectedWords
									.map(word => word.word)
									.join(" ")}
								readOnly
								type="text"
								className="w-full col-span-2 border-2 border-black p-2 rounded-md focus:outline-none focus:border-blue-300"
								placeholder="Add here..."
							/>
							{arr_sentences && arr_sentences.length > 0 && (
								<select
									onChange={e =>
										selectWord(parseInt(e.target.value, 10))
									}
									className="border-2 border-black p-2 rounded-md focus:outline-none focus:border-blue-300 appearance-none origin-top"
									name="words"
									id="words">
									<option disabled>Select</option>
									{arr_sentences.map((sentence, index) => (
										<option
											key={`${sentence.word_id}_${index}`}
											value={sentence.word_id}>
											{sentence.word}
										</option>
									))}
								</select>
							)}
							<input
								value={transSentence}
								onChange={e => setTransSentence(e.target.value)}
								type="text"
								className="w-full col-span-2 border-2 border-black p-2 rounded-md focus:outline-none focus:border-blue-300"
								placeholder="Edit here..."
							/>
							<div className="flex gap-1">
								<motion.button
									onClick={resetSelection}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="bg-yellow-300 w-1/2 mr-2 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
									&#9736; Reset
								</motion.button>
								<motion.button
									type="submit"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="bg-green-500 w-1/2 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
									&#9752; Push
								</motion.button>
							</div>
						</form>

						<table className="w-full table-auto border-collapse">
							<thead>
								<tr>
									<th className="py-2 px-4 bg-white border-black text-black font-bold uppercase text-base border-t-2 border-b-2 border-r-2">
										Sentence EN
									</th>
									<th className="py-2 px-4 bg-white border-black text-black font-bold uppercase text-base border-t-2 border-b-2 border-l-2 ">
										Sentence TH
									</th>
									<th className="py-2 px-4 bg-white border-black text-black font-bold uppercase text-base border-t-2 border-b-2 border-l-2">
										ex.
									</th>
								</tr>
							</thead>
							<tbody>
								{transSetWordAll &&
									transSetWordAll.length > 0 &&
									transSetWordAll.map(tran_x => (
										<tr key={tran_x.sentence}>
											<td className="text-sm py-2 px-4 bg-white border-b-2 border-r-2  border-black">
												{tran_x.sentence}
											</td>
											<td className="text-sm py-2 px-4 bg-white border-b-2 border-l-2 border-black">
												{tran_x.translated_sentence}
											</td>
											<td className="py-2 px-px bg-white border-b-2 border-l-2 border-black text-center">
												<div className="flex justify-center items-center">
													<motion.button
														whileHover={{
															scale: 1.05,
														}}
														whileTap={{
															scale: 0.95,
														}}
														className="bg-whitew-full mx-2 hover:bg-white text-black font-bold py-2 px-4 border-2 border-white hover:border-black">
														&#8479; Remove
													</motion.button>
												</div>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>

					<div className="bg-white text-black p-4 rounded bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg">
						<p>Show sentence example.</p>
						<textarea
							value={sanitizeText(transWordAll)}
							onClick={textTranslated}
							readOnly
							className="w-full border-2 border-gray-300 bg-gray-200 h-32 resize-none p-2 rounded-md focus:outline-none focus:border-blue-300"
							placeholder="Type here..."></textarea>
						<div className="flex justify-center items-center px-4">
							<motion.button
								onClick={pushToSecondTextArea}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-blue-500 w-full hover:bg-blue-600  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
								&#8459; Push the sentence...
							</motion.button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ComboPage;
