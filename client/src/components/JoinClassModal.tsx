import {useState} from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../components/animate-ui/radix/dialog';
import supabase from '../config/config';
import Swal from 'sweetalert2';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function JoinClassModal({ open, onOpenChange }: ModalProps) {
  const [code, setCode] = useState("");

  const submit = async () => {
    const {data, error} = await supabase.from('class_classprof').select('*').eq('class_classprof_code',code);

    if (error || data.length === 0) {
      Swal.fire({
        title:'Error Getting Code',
        text:'There has been error in getting code',
        icon:'error',
        timer:1500,
        showConfirmButton:false,
        willClose: () => {
          window.location.reload();
        }
      })
    }

    else {
      const class_classstud_code = data[0].class_classprof_code;
      const class_classstud_title = data[0].class_classprof_title;
      const class_classstud_section = data[0].class_classprof_section;
      const class_classstud_profid = data[0].class_classprof_profid;
      const class_classstud_studid = localStorage.getItem('classUsersID');

      const {error: error2} = await supabase.from('class_classstud').insert({class_classstud_code: class_classstud_code, class_classstud_title: class_classstud_title, class_classstud_section: class_classstud_section, class_classstud_profid: class_classstud_profid, class_classstud_studid: class_classstud_studid});

      if (error2) {
        Swal.fire({
          title:'Error Joining Class',
          text:'There has been error in joining class',
          icon:'error',
          timer:1500,
          showConfirmButton:false,
          willClose: () => {
            window.location.reload();
          }
        })
      }

      else {
        Swal.fire({
          title:'Class Joined',
          text:'You have successfully joined the class',
          icon:'success',
          timer:1500,
          showConfirmButton:false,
          willClose: () => {
            window.location.reload();
          }
        })
      }
    }
  }
  
  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{backgroundColor:'white'}}>
        <DialogClose></DialogClose>
        <DialogHeader>
          <DialogTitle>Join Class</DialogTitle>
          <DialogDescription>Please enter the class code given by your teacher to become part of the class.</DialogDescription>
        </DialogHeader>
        {/* Content Here */}
        <div>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Code</label>
                <div className="col-sm-10">
                    <input type="text" placeholder='Enter the code' value={code} onChange={(e) => setCode(e.target.value)} className='form-control'/>
                </div>
            </div>
        </div>
        {/* Content Here */}
        <DialogFooter>
          <button className='btn btn-outline-primary' onClick={() => submit()}>Submit</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

export default JoinClassModal;