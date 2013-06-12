((root, factory) ->
  if typeof exports is "object"

    # Node. Does not work with strict CommonJS, but
    # only CommonJS-like enviroments that support module.exports,
    # like Node.
    module.exports = factory()
  else if typeof define is "function" and define.amd

    # AMD. Register as an anonymous module.
    define ->
      root.Blobber = factory()

  else

    # Browser globals
    root.Blobber = factory()
) this, ->

#---------------------------------------------------------------------
  FS_SIZE = 20 * 1024 * 1024

  basename = (path)-> path.replace /^.*[\/\\]/g, ''

  class Blobber
    constructor: ()->

    download: (fileUrl, fileName=false, cb)->
      blobber = @
      window.URL = window.URL or window.webkitURL
      BlobBuilder = window.BlobBuilder or window.WebKitBlobBuilder

      unless fileName
        fileName = basename fileUrl

      xhr = new XMLHttpRequest()
      xhr.open "GET", fileUrl, true
      xhr.responseType = "blob"

      xhr.onload = (e) ->
        if @status is 200
          type = @getResponseHeader("content-type")
          blob = @response

          blobber.blobToFile blob, fileName, (err, file)->
            if err
              cb err
              return
            cb null, file
        else
          cb @status

      xhr.send()

    uploadProgress: (hdl)->
      @_on_uploadProgress = hdl

    upload: (url, formFields, cb)->
      data = new FormData
      for own name, val of formFields
        data.append name, val if val?

      xhr = new XMLHttpRequest()
      xhr.open "POST", url, true

      upload = xhr.upload

      if @_on_uploadProgress?
        upload.addEventListener 'progress', (e)=>
          @_on_uploadProgress e, e.loaded / e.total

      xhr.onload = (e) ->
        if @status is 200
          console.log e, this
          cb null, @response
        else
          cb @status

      xhr.send data

    blobToFile: (blob, fileName, cb)->
      onRequestFsError  = (e)->cb e
      onCreateFileError = (e)->cb e
      onWriteFileError  = (e)->cb e
      onReadFileError   = (e)->cb e

      window.webkitRequestFileSystem window.TEMPORARY, FS_SIZE, ((fs)->
        fs.root.getFile fileName, create: true, ((fileEntry) ->
            fileEntry.createWriter (writer)->
              writer.onwrite = ()->
                fileEntry.file (
                  (f)->
                    cb null, f), onReadFileError
              writer.onerror = onWriteFileError
              writer.write blob), onCreateFileError), onRequestFsError

  Blobber