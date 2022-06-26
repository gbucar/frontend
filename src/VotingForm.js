import abi from "./abi"
import {useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis"
import { useState } from "react";
import Moralis from "moralis";

const vote = async (preferredProposal, preferenceRank) => {

  await Moralis.enableWeb3()

  const options ={
    abi: abi,
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
    functionName: "vote",
    params: {
      preferredProposal: preferredProposal,
      preferenceRank: preferenceRank
    }
  }
 
  const receipt = await Moralis.executeFunction(options)
  console.log(receipt)
  return receipt
}

const SubmitButton = (props) => {
  const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction();

 const formatePreferenceRank = () => {
 const data = props.data
 const preferenceRank = props.preferenceRank
    const localPreferenceRank = [...data]
    for (let i in data){
      localPreferenceRank[i] = preferenceRank[data[i]]
    }
    return localPreferenceRank
  }

  const localVote = (e) => {
    e.preventDefault()
   const localPreferenceRank = ["1","2","3"]//formatePreferenceRank() 
   const preferredProposal = "1"//props.preferredProposal
   const params = {
    abi: abi,
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
    functionName: "vote",
    params: {
      preferredProposal: preferredProposal,
      preferenceRank: localPreferenceRank
    }
   }
    fetch({params:params})
 
  }
  console.log(data)
  return(
  <button onClick={(e)=>{
     e.preventDefault() 
      vote(1, [1,2,3])}} disabled={isLoading}>vote</button>

  )
}

export default function VotingForm() {

  const [preferredProposal, setPreferredProposal] = useState()
  const [preferenceRank, setPreferenceRank] = useState({})

  const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract({
    abi: abi,
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
    functionName: "viewElectionProposals"
  });
 
  const handleChange = e => {
    const value = parseInt(e.target.value)
    const name = e.target.attributes.name.value
    const localPreferenceRank = {...preferenceRank}
    localPreferenceRank[name] = value
    setPreferenceRank(localPreferenceRank)
  }

  const handlePreferredChange = e => {
    const value = data.indexOf(e.target.value) + 1
    setPreferredProposal(value)
  }

  return (<div>
    <button onClick={() => runContractFunction()} disabled={isFetching}>Fetch data</button>
    <form>
    <div>
        <div>name</div>
    <label htmlFor="preferred" >preferred?</label>
    </div>
{!data ? "":
    data.map(a =>(
    <>
      <label htmlFor={a}>{a}</label>
      <input onChange={handleChange} name={a} type="text" />
      <input onChange={handlePreferredChange} type="radio" name="preferred" value={a}/>
      <br />
    </>
    )
    )
  }
  <SubmitButton preferredProposal={preferredProposal} data = {data} preferenceRank={preferenceRank} />
  </form>
      </div>)
}
