package stos;

import io.stos.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import stos.StosExceptions.AttachmentConflictException;
import stos.StosExceptions.AttachmentNotFoundException;
import stos.StosExceptions.PublicationConflictException;
import stos.StosExceptions.PublicationNotFoundException;

@Endpoint
public class PublicationEndpoint {
	private static final String NAMESPACE_URI = "http://stos.io";
    private Logger logger = LoggerFactory.getLogger(PublicationEndpoint.class);

	private PublicationRepository publicationRepository = new PublicationRepository();
	private AttachmentRepository attachmentRepository = new AttachmentRepository();

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPublicationRequest") @ResponsePayload
    public GetPublicationResponse get(@RequestPayload GetPublicationRequest request) {
        GetPublicationResponse response = new GetPublicationResponse();
        Publication p = publicationRepository.getOne(request.getUid());
        if (p == null)
            throw new PublicationNotFoundException(request.getUid());

        for (String fuid : p.getAttachments()) {
            Attachment a = attachmentRepository.getOne(fuid);
            if (a == null) continue;
            response.getAttachments().add(a);
        }
        response.setPublication(p);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "createPublicationRequest") @ResponsePayload
    public CreatePublicationResponse create(@RequestPayload CreatePublicationRequest request) {
        CreatePublicationResponse response = new CreatePublicationResponse();
        Publication p = request.getPublication();
        if (publicationRepository.getOne(p.getUid()) != null)
            throw new PublicationConflictException(p.getUid());

        publicationRepository.save(request.getPublication());
        response.setPublication(request.getPublication());
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "updatePublicationRequest") @ResponsePayload
    public UpdatePublicationResponse update(@RequestPayload UpdatePublicationRequest request) {
        UpdatePublicationResponse response = new UpdatePublicationResponse();
        Publication p = request.getPublication();
        if (publicationRepository.getOne(p.getUid()) == null)
            throw new PublicationNotFoundException(p.getUid());

        publicationRepository.save(request.getPublication());
        response.setPublication(request.getPublication());
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "deletePublicationRequest") @ResponsePayload
    public DeletePublicationResponse delete(@RequestPayload DeletePublicationRequest request) {
        DeletePublicationResponse response = new DeletePublicationResponse();
        Publication p = publicationRepository.getOne(request.getUid());
        if (p == null)
            throw new PublicationNotFoundException(p.getUid());

        publicationRepository.deleteByUid(request.getUid());
        response.setPublication(p);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addAttachmentToPublicationRequest") @ResponsePayload
    public AddAttachmentToPublicationResponse attach(@RequestPayload AddAttachmentToPublicationRequest request) {
        AddAttachmentToPublicationResponse response = new AddAttachmentToPublicationResponse();
        Publication p = publicationRepository.getOne(request.getUid());
        Attachment  a = attachmentRepository.getOne(request.getFuid());
        if (a == null)
            throw new AttachmentNotFoundException(request.getFuid());

        if (p.getAttachments().contains(a.getUid()))
            throw new AttachmentConflictException(a.getUid());

        p.getAttachments().add(a.getUid());
        response.setPublication(p);
        publicationRepository.save(p);
        return response;
    }


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getAttachmentRequest") @ResponsePayload
    public GetAttachmentResponse getAttachment(@RequestPayload GetAttachmentRequest request) {
        GetAttachmentResponse response = new GetAttachmentResponse();
        Attachment a = attachmentRepository.getOne(request.getUid());
        if (a == null)
            throw new AttachmentNotFoundException(request.getUid());

        response.setAttachment(a);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "createAttachmentRequest") @ResponsePayload
    public CreateAttachmentResponse createAttachment(@RequestPayload CreateAttachmentRequest request) {
        CreateAttachmentResponse response = new CreateAttachmentResponse();
        Attachment a = request.getAttachment();
        if (attachmentRepository.getOne(a.getUid()) != null)
            throw new AttachmentConflictException(a.getUid());

        attachmentRepository.save(request.getAttachment());
        response.setAttachment(request.getAttachment());
        return response;
    }

}
