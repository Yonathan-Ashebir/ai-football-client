import {CheckCircle, XCircle, Loader2} from 'lucide-react';
import {Model, ModelStatus} from '../../types/model';

interface Props {
  status: Model['status'];
}

export default function ModelStatusDisplay({status}: Props) {
  if (status === ModelStatus.TRAINING)
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Loader2 className="w-3 h-3 mr-1 animate-spin"/>
          Training
        </span>
    );
  else if (status === ModelStatus.READY)
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1"/>
          Ready
        </span>
    );
  else return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 group">
          <XCircle className="w-3 h-3 mr-1"/>
          Failed
        </span>
    );
}