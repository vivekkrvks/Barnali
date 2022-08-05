import Head from 'next/head'
import  { useState,useEffect} from "react";
import axios from "axios";
import Router from "next/router";
import {Typography,TextField, Grid, Button,Fab, Snackbar,Alert,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,CircularProgress  } from '@mui/material';
import styles from '../styles/Home.module.css'
import { FcFeedback } from "react-icons/fc";
import {BsFillPenFill} from "react-icons/bs"
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();


  const [mobileNo, setMobileNo] = useState("");
  const [snack, setSnack] =useState(false)
	const [snackData, setSnackData] = useState({ message: "", severity: "success" });
  const [otpBox, setOTPBox]=useState(false)
  const [otp, setOTP]=useState("")
  const [openDialog, setOpenDialog]=useState(false)
	const [image, setImage] = useState("");
  const [waiting, setWaiting]=useState(false);
  const [showReplyBtn, setReplyBtn]=useState(false)



  const handleSnack = (d) => {
    setSnack(!snack);
    setSnackData(d)
  };
  const handleOTPSubmit = async()=>{

    if(mobileNo.length===10){
     
      let newUser = {mobileNo,otp}
		await axios
			.post("https://searchkarna.com/api/v1/addition/barnali/check", newUser)
			.then((res) => {
				if (res.data.variant == "success") {
          localStorage.setItem('id', res.data.id);
          setOpenDialog(true)
				} else {
					snackRef.current.handleSnack(res.data);
				}
			})
			.catch((err) => console.log(err));
    }else handleSnack({message: "Mobile Number is not Valid", severity: "warning" })

  }
  const handleSubmit = async (e) => {
		e.preventDefault();

    if(mobileNo.length===10){
      let newUser = {mobileNo}
		await axios
			.post("https://searchkarna.com/api/v1/addition/barnali/sendOtp", newUser)
			.then((res) => {
				if (res.data.variant == "success") {
          handleSnack({message: "OTP has sent to your Mobile", severity: "success" })
          setOTPBox(true)
				} else {
					snackRef.current.handleSnack(res.data);
				}
			})
			.catch((err) => console.log(err));
    }else handleSnack({message: "Mobile Number is not Valid", severity: "warning" })

	};
  useEffect(() => {
		saveOnLoad();
	}, []);
  const saveOnLoad = async (e) => {

		await axios
			.get("https://searchkarna.com/api/v1/addition/barnali/saveOnce")
			.then()
			.catch((err) => console.log(err));
    }

	
  
  const imgUpload = async (e) => {
   setWaiting(true);
    if (e) {
			const selectedFile = e;
			const imgData = new FormData();
			imgData.append("photo", selectedFile, selectedFile.name);
			await axios
				.post(`https://searchkarna.com/api/v1/other/fileupload/mainfolder/barnali`, imgData, {
					headers: {
						accept: "application/json",
						"Accept-Language": "en-US,en;q=0.8",
						"Content-Type": `multipart/form-data; boundary=${imgData._boundary}`,
					},
				})
				.then((res) => {setImage(res.data.result.secure_url); console.log(image); setWaiting(false)})
				.catch((err) => console.log(err));
	}
 }
  const handleIdentity= async(e)=>{
    if(waiting){
        handleSnack({message: "Please Wait Photo is uploading...", severity: "info" })
    }else{
      if(image){
      let newUser = {userImage : image}
      let id = localStorage.getItem('id')
      await axios
        .post(`https://searchkarna.com/api/v1/addition/barnali/uploadImg/${id}`, newUser)
        .then((res) => {
          if (res.data.variant == "success") {
            handleSnack({message: "Photo sent", severity: "success" })
            
            setReplyBtn(true)

          } else {
            snackRef.current.handleSnack(res.data);
          }
        })
        .catch((err) => console.log(err));
    }else{
      handleSnack({message: "Kindly Upload Selfie", severity: "info" })
    }
    }
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>A Letter to Barnali</title>
        <meta name="description" content="A Letter to Barnali" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {`Hello, `}<span>{`Barnali !`}</span>
        </h1>

        <p className={styles.description}>
        {` Dear Barnali, Before proceeding further, it is nessary to verify your indentity.`} <br/>
 </p>
          <Typography variant="subtitle2" gutterBottom component="div">
         {`Please note that, Your data`} <b>{`will NOT be used`}</b> {`for any other purpose at any codition.`}<br/> {`This is taken just to ensure that you are really Barnali, not anyone else.`}
      </Typography>
<br/>
    
<Grid container spacing={4}>
							<Grid item xs={12}>
                <TextField id="outlined-basic" style={{background:"#fff", borderRadius:"20px"}} disabled={otpBox} value={mobileNo} required label="Enter your Mobile No." onChange={e=>setMobileNo(e.target.value)} type="number" fullWidth variant="outlined" placeholder="Enter 10 Digit Mobile No" />
              </Grid>
           
								{otpBox ?  <>
                <Grid item xs={12}>
              <TextField id="otp" style={{background:"#fff",borderRadius:"20px"}} required label="Enter the OTP" value={otp} onChange={e=>setOTP(e.target.value)} type="number" fullWidth variant="outlined" placeholder="Enter OTP" />
               </Grid> 
               <Grid item xs={12}>
                <Button onClick={() => handleOTPSubmit()} variant="contained" color="primary" fullWidth>
							      Submit OTP
								</Button>
               </Grid>
                </> :
                   <Grid item xs={12}>
                <Button onClick={(e) => handleSubmit(e)} variant="contained" color="primary" fullWidth>
							      Get OTP
								</Button>
                </Grid>
                }
							
               
             
</Grid>

<Dialog open={openDialog} onClose={()=>setOpenDialog(false)}>
        <DialogTitle>{`Thank you, Barnali !`}</DialogTitle>
       <DialogContent>
          <DialogContentText>
             <Typography variant="caption" display="block" gutterBottom>
       {`You are just one step behind, please upload your one picture (selfie) to prove your identity.`}
      </Typography>
          </DialogContentText>
            {waiting && <div className='center'><CircularProgress color="inherit" /></div>}
          <TextField
            autoFocus
            margin="dense"
            variant="outlined"
						type="file"
						InputLabelProps={{ shrink: true }}
						inputProps={{ accept: "image/*" }}
						fullWidth
						label="Upload your Selfie"
						onChange={(e) => imgUpload(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions style={{flexDirection:'column'}}>  
          <Button variant="outlined" fullWidth style={{fontSize:"10px"}} download href={image ? "https://barnali.globalsecurityint.com/Letter-to-Barnali.pdf" : null} startIcon={<FcFeedback />} onClick={handleIdentity} target="_blank">Download Letter</Button> <br/>
      {showReplyBtn &&     
<Button onClick={() => router.push('/reply')} size="small" variant="outlined" fullWidth color="secondary" aria-label="add" startIcon={<BsFillPenFill /> } >
  Write Your Reply
</Button>
      }
      
        </DialogActions>
      </Dialog>

      <Snackbar open={snack} autoHideDuration={6000} onClose={()=>setSnack(false)}>
        <Alert onClose={()=>setSnack(false)} severity={snackData.severity} sx={{ width: '100%' }}>
          {snackData.message}
        </Alert>
      </Snackbar>
       

      </main>

      
    </div>
  )
}
