import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	InsertNewWords,
	InsertThaiWord,
	FetchNewData,
	insertTextTranslated,
	FetchTransSetData,
} from "../features/authSlice";
import { Element, scroller } from "react-scroll";

const TranslatePage = () => {
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

	// Insert sentences
	const dispatch = useDispatch();
	const arr_sentences = useSelector(state => state.auth.sentences);
	const tran_set = useSelector(state => state.auth.translatedSet);
	const tran_all = useSelector(state => state.auth.sentenceThai);

	//Real time xx
	const [transWordAll, setTransWordAll] = useState(tran_all.trans_all_word);

	useEffect(() => {
		if (arr_sentences) {
			console.log(arr_sentences);
		}
		if (tran_set) {
			console.log(tran_set);
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
	const thaiWord = async (event, index) => {
		event.preventDefault();
		const word_id = arr_sentences[index].word_id;

		try {
			await dispatch(
				InsertThaiWord({
					inputThai: inputThai[index],
					engWordId: word_id,
				})
			);

			// Fetch updated data after successfully inserting Thai word
			await dispatch(
				FetchNewData({
					arr_sentences: arr_sentences.map(sentence => sentence),
				})
			);

			await dispatch(
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

		setCountSentences(sentencesArray);
		setOutputText(sentencesArray[0] || "");
		setCurrentSentenceIndex(0);

		scroller.scrollTo("section2", {
			duration: 500,
			delay: 0,
			smooth: "easeInOutQuart",
		});
	};

	const showNextSentence = () => {
		if (currentSentenceIndex < countSentences.length - 1) {
			setCurrentSentenceIndex(currentSentenceIndex + 1);
			setOutputText(countSentences[currentSentenceIndex + 1]);
			setInputThai([]);
			setSelectedWords([]);
			setCurrentIndex(0);
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
		setSelectedWords([]);
		setCurrentIndex(0);
		setTransSentence("");
	};

	const textTranslated = async e => {
		e.preventDefault();

		const wordOrder = selectedWords.map(word => word.word_id);
		const word_text = selectedWords.map(word => word.word);

		await dispatch(
			insertTextTranslated({
				engSentence: word_text,
				wordOrder,
				transSentence: transSentence,
			})
		);

		await dispatch(
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
		<div className="flex bg-gradient-pink-blue min-h-screen gap-4">
			<div id="first-box" className="sticky top-0 ">
				<div className="border rounded-md bg-white p-8 mt-8 max-w-2xl mx-auto gap-10">
					<h1>ผลลัพธ์</h1>
					<textarea
						className="block p-2.5 w-full text-lg text-gray-700 rounded-lg border border-super-pink focus:ring-green-tree focus:border-blue-400"
						name="xx"
						id="xx"
						cols="30"
						onChange={event =>
							setSecondTextAreaContent(event.target.value)
						}
						value={sanitizeText(secondTextAreaContent)}
						rows="10"></textarea>
				</div>
			</div>
			<div id="second-box" className="flex flex-col overflow-y-auto">
				<Element name="section1">
					<div className="flex flex-col border rounded-md bg-white p-8 mt-8 max-w-2xl mx-auto gap-10">
						<div className="max-w-2xl mx-auto">
							<label
								htmlFor="pos-english"
								className="text-lg font-mono">
								All sentences
							</label>
							<textarea
								placeholder="Where are you..."
								name="sentences"
								id="sentences"
								cols="200"
								rows="20"
								value={inputText}
								onChange={e => setInputText(e.target.value)}
								className="block p-2.5 w-full text-lg text-gray-700 rounded-lg border border-super-pink focus:ring-green-tree focus:border-blue-400"></textarea>
						</div>
						<button
							type="button"
							onClick={separateSentences}
							className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ">
							Separate sentences
						</button>
					</div>
				</Element>
				<Element name="section2">
					<div className="flex flex-col border rounded-md bg-white p-8 mt-8 max-w-2xl mx-auto gap-10">
						<form
							onSubmit={insertText}
							className="max-w-2xl mx-auto">
							<div className="flex justify-between">
								<label
									htmlFor="pos-english"
									className="font-mono text-lg">
									English
								</label>
								<p>
									{currentSentenceIndex + 1} จาก{" "}
									{countSentences.length} ประโยค
								</p>
							</div>
							<textarea
								placeholder="I will appear hear he he ~~~~"
								name="pos-english"
								value={outputText}
								onChange={e => setOutputText(e.target.value)}
								id="pos-english"
								cols="200"
								rows="10"
								readOnly
								className="block p-2.5 w-full text-lg text-gray-700 rounded-lg border border-super-pink focus:ring-green-tree focus:border-blue-400"></textarea>
							<div className="m-4">
								<button
									type="button"
									onClick={showPreviousSentence}
									className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
									Previous sentence
								</button>
								<button
									type="button"
									onClick={showNextSentence}
									className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
									Next sentence
								</button>
								<button
									type="button"
									onClick={insertText}
									className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
									Check word
								</button>
							</div>
						</form>
						<div className="flex flex-col border-t-2 border-red-500">
							<div className="mt-2">
								<p className="mb-4">แปลยัง?</p>
								<table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
									<thead>
										<tr className="text-base text-black">
											<th>Word</th>
											<th>คำแปล</th>
											<th>เพิ่มคำแปล</th>
											<th>ex.</th>
										</tr>
									</thead>
									<tbody>
										{arr_sentences &&
											arr_sentences.length > 0 &&
											arr_sentences.map(
												(sentence, index) => (
													<tr
														key={`${sentence.word_id}_${index}`}
														className="text-base text-black">
														<td>{sentence.word}</td>
														<td>
															{sentence.meaning}
														</td>
														<td>
															<input
																required
																value={
																	inputThai[
																		index
																	] || ""
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
																name="translation"
																id="translation"
																className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
																type="text"
															/>
														</td>
														<td>
															<button
																type="button"
																onClick={e =>
																	thaiWord(
																		e,
																		index
																	)
																}
																className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ">
																มาดิ!
															</button>
														</td>
													</tr>
												)
											)}
									</tbody>
								</table>
							</div>
							<div className="mt-2">
								<form onSubmit={textTranslated}>
									<p>แปลประโยค</p>
									<label
										htmlFor="words"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Select words
									</label>
									{arr_sentences &&
										arr_sentences.length > 0 && (
											<select
												id="words"
												onChange={e =>
													selectWord(
														parseInt(
															e.target.value,
															10
														)
													)
												}
												className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
												<option selected disabled>
													Choose a word
												</option>
												{arr_sentences.map(
													(sentence, index) => (
														<option
															key={`${sentence.word_id}_${index}`}
															value={
																sentence.word_id
															}>
															{sentence.word}
														</option>
													)
												)}
											</select>
										)}
									<label htmlFor="word_select">
										คำที่เลือก
									</label>
									<input
										readOnly
										id="word_select"
										type="text"
										value={selectedWords
											.map(word => word.word)
											.join(" ")}
										className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
									/>
									<label htmlFor="sentence">ใส่ประโยค</label>
									<input
										value={transSentence}
										onChange={e =>
											setTransSentence(e.target.value)
										}
										id="sentence"
										type="text"
										className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
									/>
									<button
										onClick={resetSelection}
										className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
										รีคำ
									</button>
									<button
										type="submit"
										className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
										บันทึก
									</button>
								</form>
								<div className="mt-2">
									<table className="w-full text-sm text-left rtl:text-right text-gray-500">
										<thead className="uppercase">
											<tr className="text-base text-black">
												<th>ประโยค</th>
												<th>แปล</th>
												<th>ex.</th>
											</tr>
										</thead>
										<tbody>
											{tran_set &&
												tran_set.length > 0 &&
												tran_set.map(tran_x => (
													<tr
														key={tran_x.sentence}
														className="border-b border-gray-200">
														<td className="text-base text-black ">
															{tran_x.sentence}
														</td>
														<td className="text-base text-black">
															{
																tran_x.translated_sentence
															}
														</td>
														<td className="text-base text-black ">
															ลบ
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col border rounded-md bg-white p-8 mt-8 max-w-2xl mx-auto">
						<button
							onClick={pushToSecondTextArea}
							className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
							Push word
						</button>
						<textarea
							value={sanitizeText(transWordAll)}
							onChange={textTranslated}
							name="all_trans"
							id="all_trans"
							cols="30"
							rows="10"
							className="block p-2.5 w-full text-lg text-gray-700 rounded-lg border border-super-pink focus:ring-green-tree focus:border-blue-400"
						/>
					</div>
				</Element>
			</div>
		</div>
	);
};

export default TranslatePage;
