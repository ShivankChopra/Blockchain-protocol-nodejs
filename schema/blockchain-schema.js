const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// transaction input schema
const InputSchema = new Schema({
    id:{
        type: String,
        required: true
    },
    timestamp:{
        type: Date,
        required:true
    },
    address:{
        type: String,
        required: true
    },
    balance:{
        type: Number,
        required: true
    },
    signature:{ // need to check it's correctness
        type: String,
        required: true
    }
});

mongoose.model('input', InputSchema);

// transaction single output schema
const SingleOutputSchema = new Schema({
    address:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    }
});

mongoose.model('singleOutput', SingleOutputSchema);

// transaction overall outputs schema
const OutputsSchema = new Schema({
    toReciever:{
        type: SingleOutputSchema,
        required: true
    },
    toSelf:{
        type: SingleOutputSchema,
        required: true
    }
});

mongoose.model('outputs', OutputsSchema);

// transaction schema
const TransactionSchema = new Schema({
    input:{
        type: InputSchema,
        required: true
    },
    outputs:{
        type: OutputsSchema,
        required: true
    }
});

mongoose.model('transaction', TransactionSchema);

// block schema
const BlockSchema = new Schema({
    nonce:{
        type: Number,
        required: true
    },
    timestamp:{
        type: Date, //  check it's correctness
        required: true
    },
    lasthash:{
        type: String,
        required: true
    },
    hash:{
        type: String,
        required: true
    },
    data:{
        type: [TransactionSchema],
        required: true
    }
});

mongoose.model('block', BlockSchema);