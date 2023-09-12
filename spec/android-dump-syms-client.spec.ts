import { AndroidDumpSymsClient } from '../index';

describe('AndroidDumpSymsClient', () => {
    let sut: AndroidDumpSymsClient;
    
    let fakeClient
    let fakeFormData;
    let result;

    const fakeBlob = new Blob([]);
    const fakePath = 'fakePath';
    const fakeResult = 'fakeResult;'

    beforeEach(async () => {
        fakeClient = jasmine.createSpyObj('ApiClient', ['createFormData', 'fetch']);
        fakeFormData = jasmine.createSpyObj('FormData', ['append']);
        fakeClient.createFormData.and.returnValue(fakeFormData);
        fakeClient.fetch.and.resolveTo(fakeResult);
        sut = new (AndroidDumpSymsClient as any)(fakeClient);
        (sut as any).blobFrom = jasmine.createSpy();
        ((sut as any).blobFrom as jasmine.Spy).and.resolveTo(fakeBlob);
        result = await sut.upload(fakePath);
    });

    describe('upload', () => {
        it('should fetch from correct endpoint', () => {
            expect(fakeClient.fetch).toHaveBeenCalledWith('/post/android/symbols', jasmine.any(Object));
        });

        it('should call blobFrom with path', () => {
            expect((sut as any).blobFrom).toHaveBeenCalledWith(fakePath);
        });

        it('should append file', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('file', fakeBlob, fakePath);
        });

        it('should return response', () => {
            expect(result).toBe(fakeResult);
        });
    });
});