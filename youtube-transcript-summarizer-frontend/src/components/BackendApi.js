import braille from 'braille';
import Tabs from "./Tabs";
import ET from "../transcripts/English.txt";
import HT from "../transcripts/Hindi.txt";
import GT from "../transcripts/Gujarati.txt";
import { useState } from 'react';


export default function BackendAPI(props) {
	const [cred, setCred] = useState({
		message: '',
		englishTranscript: '',
		hindiTranscript: '',
		gujaratiTranscript: '',
		originalTextLength: '',
		summarizedTextLength: '',
		brailleText: ''
	})
	const [failedMessage, setFailedMessage] = useState(null)
	const [name, setName] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)


	const handleSubmit = async (event) => {

		event.preventDefault();
		setIsLoading(true);
		setIsLoaded(false)

		var FinalURL = `http://localhost:5000/api?video_url=${name}`;
		console.log(name)
		let response = await fetch(FinalURL);
		const serveres = await response.json();
		if (serveres.data) {
			const newCred = {
				message: serveres.data.message,
				englishTranscript: serveres.data.eng_summary,
				hindiTranscript: serveres.data.hind_summary,
				gujaratiTranscript: serveres.data.guj_summary,
				originalTextLength: serveres.data.original_txt_length,
				summarizedTextLength: serveres.data.final_summ_length,
				brailleText: braille.toBraille(serveres.data.eng_summary)
			}
			setCred(newCred)
			setIsLoaded(true)
			setIsLoading(false)
			setName('')
		}
		else {
			setError(serveres.data)
		}

	}

	const handleChange = (event) => {
		setName(event.target.value)
	}

	const stopAudio = () => {

		window.speechSynthesis.cancel();
	}

	const textToAudio = () => {

		var synth = window.speechSynthesis;
		var utterance = new SpeechSynthesisUtterance(cred.englishTranscript);
		synth.speak(utterance);
	}

	return (
		<>
			{!isLoaded && !isLoading && <> <form onSubmit={handleSubmit}>
				<label>
					Video URL:
				</label>
				<input className="input-1" type="url" value={name} placeholder="Paste your YouTube Video link here." name="name" onChange={handleChange} required autoComplete="off" />
				<input className="submit-1" type="submit" value="Summarize" />
			</form>
				<p>Original Length<i className="arrow right"></i>Final Length</p>
				<Tabs>
					<div label="English">
						<div className="tab-content-1">
							English Summarized Text Will be Shown Here...
						</div>
					</div>
					<div label="Hindi">
						<div className="tab-content-1">
							Hindi Summarized Text Will be Shown Here...
						</div>
					</div>
					<div label="Gujarati">
						<div className="tab-content-1">
							Gujarati Summarized Text Will be Shown Here...
						</div>
					</div>
					<div label="Braille">
						<div className="tab-content-1">
							{braille.toBraille("Braille Summarized Text Will be Shown Here...")}
						</div>
					</div>
				</Tabs></>}
			{isLoaded && !isLoading && <>
				<form onSubmit={handleSubmit}>
					<label>
						Video URL:
					</label>
					<input className="input-1" type="url" value={name} placeholder="Paste your YouTube Video link here." name="name" onChange={handleChange} required autoComplete="off" />
					<input className="submit-1" type="submit" value="Summarize" />
				</form>
				<p>{cred.originalTextLength}<i className="arrow right"></i>{cred.summarizedTextLength}</p>
				<Tabs>
					<div label="English">
						<div className="tab-content">
							<div>
								<center>
									<button className="btn-1" type="button" onClick={textToAudio}>Speak</button>
									<button className="btn-1" type="button" onClick={stopAudio}>Stop</button>
								</center>
								<center>
									<a href={ET} className="buttonDownload" download="English_Transcript.txt" type="button">Download</a>
								</center>
							</div>
							{cred.englishTranscript}
						</div>
					</div>
					<div label="Hindi">
						<div className="tab-content">
							<div>
								<center>
									<a href={HT} className="buttonDownload" download="Hindi_Transcript.txt" type="button">Download</a>
								</center>
							</div>
							{cred.hindiTranscript}
						</div>
					</div>
					<div label="Gujarati">
						<div className="tab-content">
							<div>
								<center>
									<a href={GT} className="buttonDownload" download="Gujarati_Transcript.txt" type="button">Download</a>
								</center>
							</div>
							{cred.gujaratiTranscript}
						</div>
					</div>
					<div label="Braille">
						<div className="tab-content">
							<div>
								<center>
									<a href={ET} className="buttonDownload" download="Braille_Transcript.txt" type="button">Download</a>
								</center>
							</div>
							{cred.brailleText}
						</div>
					</div>
				</Tabs>
			</>}
			{isLoading && !isLoaded && <>
					<form onSubmit={handleSubmit}>
						<label>
							Video URL:
						</label>
						<input className="input-1" type="url" value={name} placeholder="Paste your YouTube Video link here." name="name" onChange={handleChange} required autoComplete="off" />
						<input className="submit-1" type="submit" value="Summarize" />
					</form>
					<center>
						<div className="lds-ripple"><div></div><div></div></div>
					</center>
					<Tabs>
						<div label="English">
							<div className="tab-content-1">
								English Summarized Text Will be Shown Here...
							</div>
						</div>
						<div label="Hindi">
							<div className="tab-content-1">
								Hindi Summarized Text Will be Shown Here...
							</div>
						</div>
						<div label="Gujarati">
							<div className="tab-content-1">
								Gujarati Summarized Text Will be Shown Here...
							</div>
						</div>
						<div label="Braille">
							<div className="tab-content-1">
								{braille.toBraille("Braille Summarized Text Will be Shown Here...")}
							</div>
						</div>
					</Tabs>
				</>}
		</>
	)
}