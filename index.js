var Buffer = require('buffer/').Buffer;

function clearBit (num, i) {
  var mask = ~(1 << i);
  return num & mask;
}

function setBit (num, i, val) {
  var mask = 1 << i;
  if (val) {
    return num | mask;
  }
  else {
    return num & ~mask;
  }
}

function getBit (num, i) {
  var mask = 1 << i;
  return (num & mask) >> i;
}

function Imgbed (buffer) {
  if (!Buffer.isBuffer(buffer)) {
    buffer = new Buffer(buffer);
  }

  this._buffer           = buffer;
  this._ignoreAlpha      = true;
  this.BYTES_PER_ELEMENT = this._buffer.BYTES_PER_ELEMENT || 1;

  this.length            = 0|(this._buffer.length / (this.BYTES_PER_ELEMENT * 8));
  if (this._ignoreAlpha) {
    this.length = this.length - 0|(this.length / 4);
  }

  this._data = null;
}

Imgbed.prototype.clear = function () {
  this._data = null;
  for (var i = this._buffer.length - 1; i >= 0; i--)  {
    if (this._ignoreAlpha && (i + 1) % 4 === 0) continue;
    this._buffer[i] = clearBit(this._buffer[i], 0);
  }
};

Imgbed.prototype.data = function () {
  // @todo don't hard code `8`?
  if (this._data) return this._data;

  var data         = new Buffer(this.length)
    , i            = 0
    , numBits      = this.length * 8
    , currBuffByte = 0
    , currDataByte = 0
    , currDataBit  = 0
    , bit          = 0
    ;

  while (i < numBits) {
    bit = getBit(this._buffer[currBuffByte], 0);
    data[currDataByte] = setBit(data[currDataByte], currDataBit, bit);

    i++;

    currBuffByte++;
    if (this._ignoreAlpha && (currBuffByte + 1) % 4 === 0) {
      currBuffByte++;
    }

    currDataBit++;
    if (i % 8 === 0) {
      currDataBit = 0;
      currDataByte++;
    }
  }

  // for (i = 0; i < numBits; i++) {
  //   currByte = 0|(i / 8);
  //   currBit  = 0|(i % 8);
  //   bit      = getBit(this._buffer[i], 0);
  //
  //   computedBuffer[currByte] = setBit(computedBuffer[currByte], currBit, bit);
  // }

  this._data = data;
  return data;
};

Imgbed.prototype.write = function (string, offset, length, encoding) {
  // @todo check that string is really a string
  // @todo do stuff with encoding, offset, and length
  // @todo don't hard code `8`?

  this._data = null;

  var strBuffer    = new Buffer(string)
    , offset       = offset || 0
    , length       = length || strBuffer.length
    , i            = 0
    , numBits      = length * 8
    , currBuffByte = 0
    , currStrByte  = 0
    , currStrBit   = 0
    , bit          = 0
    ;

  while (i < numBits) {
    bit = getBit(strBuffer[currStrByte], currStrBit);
    this._buffer[currBuffByte] = setBit(this._buffer[currBuffByte], 0, bit);

    i++;

    currBuffByte++;
    if (this._ignoreAlpha && (currBuffByte + 1) % 4 === 0) {
      currBuffByte++;
    }

    currStrBit++;
    if (i % 8 === 0) {
      currStrBit = 0;
      currStrByte++;
    }
  }

  // for (i = 0; i < numBits; i++) {
  //   currByte = 0|(i / 8);
  //   currBit  = 0|(i % 8);
  //   bit      = getBit(strBuffer[currByte], currBit);
  //
  //   this._buffer[i] = setBit(this._buffer[i], 0, bit);
  // }
};

Imgbed.prototype.toString = function (encoding, start, end) {
  // @todo use encoding
  // @todo use start
  // @todo use end

  return this.data().toString(encoding);
};

Imgbed.prototype.copy = function (targetBuffer, targetStart, sourceStart, sourceEnd) {
  // @todo use targetStart
  // @todo use sourceStart
  // @todo use sourceEnd

  return buffer = this.data().copy(targetBuffer);
};

module.exports = Imgbed;
