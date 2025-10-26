import React, {useState, useEffect} from "react";
import supabase from "../config/config";
import Swal from 'sweetalert2';

interface UpdateAddressModalProps {
  show: boolean;
  onClose: () => void;
}

export default function UpdateAddressModal({ show, onClose }: UpdateAddressModalProps) {
  if (!show) return null;

  const classUsersID = localStorage.getItem('classUsersID');
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    getCurrentAddress();
  },[]);

  const getCurrentAddress = async () => {
    const {data, error} = await supabase.from('class_users').select('*').eq('class_users_id',classUsersID);

    if (error) {
      Swal.fire({
        title:'Error Getting Current Address',
        text:'There has been error in getting current address',
        icon:'error'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      })
    }

    else {
      setCurrentAddress(data[0].class_users_address);
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      title:'Are You Sure?',
      text:'Do you want to update your address?',
      icon:'info',
      showDenyButton:true
    }).then(async (result) => {
      if (result.isConfirmed) {
        const {error} = await supabase.from('class_users').update({class_users_address: currentAddress}).eq('class_users_id',classUsersID);

        if (error) {
          Swal.fire({
            title:'Error Updating Address',
            text:'There has been error in updating address',
            icon:'error'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          })
        }

        else {
          Swal.fire({
            title:'Address Updated',
            text:'Your address has been updated successfully',
            icon:'success'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          })
        }
      } else if (result.isDenied) {
        window.location.reload();
      }
    })
  }

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Update Address</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <form onSubmit={submit}>
                <input type="text" value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} className="form-control"/>
                <br />
                <div className="modal-footer">
                    <button className="btn btn-primary w-100">Enter</button>
                </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
