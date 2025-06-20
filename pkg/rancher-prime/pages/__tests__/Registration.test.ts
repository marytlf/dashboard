import Registration from '../Registration.vue';
import { mount, VueWrapper } from '@vue/test-utils';

// Mock for useI18n
jest.mock('vuex', () => ({
  useStore: () => {
    jest.fn();
  }
}));

describe('page: Registration', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(Registration, {
      global: {
        mocks: {
          $store: {
            getters: {
              'i18n/exists': jest.fn().mockReturnValue(true),
              'i18n/t':      (t: string) => t
            }
          },
          $route:  { hash: 'online' },
          $router: {
            currentRoute: { _value: { name: 'online' } },
            replace:      jest.fn()
          },
        },
        stubs: {
          LabeledInput: true,
          AsyncButton:  true,
          FileSelector: true
        }
      }
    });
  });

  it('should render', () => {
    expect(wrapper).toBeDefined();
  });

  describe('given no data', () => {
    it('should prevent new online request', () => {
      const registerOnlineButton = wrapper.find('[data-testid="registration-online-cta"]');

      expect(registerOnlineButton.isDisabled()).toStrictEqual(true);
    });

    it('should allow new online request given a registration code', async() => {
      wrapper.vm.registrationCode = 'whatever';
      await wrapper.vm.$nextTick();
      const registerOnlineButton = wrapper.find('[data-testid="registration-online-cta"]');

      expect(registerOnlineButton.isDisabled()).toStrictEqual(false);
    });

    it('should allow to type the registration code', () => {
      const registerOnlineInput = wrapper.find('[data-testid="registration-code-input"]');

      expect(registerOnlineInput.isDisabled()).toStrictEqual(false);
    });

    it('should allow to download registration request', () => {
      const registerOfflineDownload = wrapper.find('[data-testid="registration-offline-download"]');

      expect(registerOfflineDownload.isDisabled()).toStrictEqual(false);
    });

    it('should allow new offline request', () => {
      const registerOfflineButton = wrapper.find('[data-testid="registration-offline-cta"]');

      expect(registerOfflineButton.isDisabled()).toStrictEqual(false);
    });

    it('should not allow deregistration', () => {
      const deregisterButtonOnline = wrapper.find('[data-testid="registration-deregister-cta"]');

      expect(deregisterButtonOnline.isDisabled()).toBe(true);
    });
  });

  describe('given registration online', () => {
    beforeEach(() => {
      wrapper.vm.registrationStatus = 'registered-online';
    });

    it('should not display online registration button', () => {
      const registerOnlineButton = wrapper.find('[data-testid="registration-online-cta"]');

      expect(registerOnlineButton.isDisabled()).toBe(true);
    });

    it('should prevent to type the registration code', () => {
      const registerOnlineInput = wrapper.find('[data-testid="registration-code-input"]');

      expect(registerOnlineInput.attributes().disabled).toStrictEqual('true');
    });

    it('should prevent to download registration request', () => {
      const registerOfflineDownload = wrapper.find('[data-testid="registration-offline-download"]');

      expect(registerOfflineDownload.isDisabled()).toStrictEqual(true);
    });

    it('should prevent new offline request', () => {
      const registerOfflineButton = wrapper.find('[data-testid="registration-offline-cta"]');

      expect(registerOfflineButton.isDisabled()).toStrictEqual(true);
    });

    it('should allow to deregister', () => {
      const deregisterButtonOnline = wrapper.find('[data-testid="registration-deregister-cta"]');

      expect(deregisterButtonOnline.isDisabled()).toBe(false);
    });
  });

  describe('given registration offline', () => {
    beforeEach(() => {
      wrapper.vm.registrationStatus = 'registered-offline';
    });

    it('should not allow offline registration', () => {
      const registerOfflineButton = wrapper.find('[data-testid="registration-offline-cta"]');

      expect(registerOfflineButton.isDisabled()).toBe(true);
    });

    it('should prevent to type the registration code', () => {
      const registerOnlineInput = wrapper.find('[data-testid="registration-code-input"]');

      expect(registerOnlineInput.attributes().disabled).toStrictEqual('true');
    });

    it('should prevent new online request', () => {
      const registerOnlineButton = wrapper.find('[data-testid="registration-online-cta"]');

      expect(registerOnlineButton.isDisabled()).toStrictEqual(true);
    });

    it('should prevent to download registration request', () => {
      const registerOfflineDownload = wrapper.find('[data-testid="registration-offline-download"]');

      expect(registerOfflineDownload.isDisabled()).toStrictEqual(true);
    });
  });

  describe('while registering online', () => {
    beforeEach(() => {
      wrapper.vm.registrationStatus = 'registering-online';
    });

    it('should prevent new online request', () => {
      const registerOnlineButton = wrapper.find('[data-testid="registration-online-cta"]');

      expect(registerOnlineButton.isDisabled()).toStrictEqual(true);
    });

    it('should prevent new offline request', () => {
      const registerOfflineButton = wrapper.find('[data-testid="registration-offline-cta"]');

      expect(registerOfflineButton.isDisabled()).toStrictEqual(true);
    });

    it('should not allow deregistration', () => {
      const deregisterButton = wrapper.find('[data-testid="registration-deregister-cta"]');

      expect(deregisterButton.isDisabled()).toBe(true);
    });
  });

  describe('while registering offline', () => {
    beforeEach(() => {
      wrapper.vm.registrationStatus = 'registering-offline';
    });

    it('should prevent new online request', () => {
      const registerOnlineButton = wrapper.find('[data-testid="registration-online-cta"]');

      expect(registerOnlineButton.isDisabled()).toStrictEqual(true);
    });

    it('should prevent new offline request', () => {
      const registerOfflineButton = wrapper.find('[data-testid="registration-offline-cta"]');

      expect(registerOfflineButton.isDisabled()).toStrictEqual(true);
    });

    it('should not allow deregistration', () => {
      const deregisterButton = wrapper.find('[data-testid="registration-deregister-cta"]');

      expect(deregisterButton.isDisabled()).toBe(true);
    });
  });

  describe('while de-registering a online case', () => {
    beforeEach(() => {
      wrapper.vm.registrationStatus = 'registered-online';
    });

    it('should prevent new online request', () => {
      const registerOnlineButton = wrapper.find('[data-testid="registration-online-cta"]');

      expect(registerOnlineButton.isDisabled()).toStrictEqual(true);
    });

    it('should prevent to type the registration code', () => {
      const registerOnlineInput = wrapper.find('[data-testid="registration-code-input"]');

      expect(registerOnlineInput.attributes().disabled).toStrictEqual('true');
    });

    it('should prevent new offline request', () => {
      const registerOfflineButton = wrapper.find('[data-testid="registration-offline-cta"]');

      expect(registerOfflineButton.isDisabled()).toStrictEqual(true);
    });

    // TODO - #13387: This is component specific, update after implementation
    // it('should prevent new online de-registration request', () => {
    //   const deregisterButtonOnline = wrapper.find('[data-testid="registration-deregister-cta"]');

    //   expect(deregisterButtonOnline.isDisabled()).toStrictEqual(true);
    // });

    // it('should prevent new offline de-registration request', () => {
    //   const deregisterButton = wrapper.find('[data-testid="registration-offline-deregister-cta"]');

    //   expect(deregisterButton.isDisabled()).toStrictEqual(true);
    // });
  });

  describe('while de-registering a offline case', () => {
    beforeEach(() => {
      wrapper.vm.registrationStatus = 'registered-offline';
    });

    it('should prevent new online request', () => {
      const registerOnlineButton = wrapper.find('[data-testid="registration-online-cta"]');

      expect(registerOnlineButton.isDisabled()).toStrictEqual(true);
    });

    it('should prevent to type the registration code', () => {
      const registerOnlineInput = wrapper.find('[data-testid="registration-code-input"]');

      expect(registerOnlineInput.attributes().disabled).toStrictEqual('true');
    });

    it('should prevent new offline request', () => {
      const registerOfflineButton = wrapper.find('[data-testid="registration-offline-cta"]');

      expect(registerOfflineButton.isDisabled()).toStrictEqual(true);
    });

    // TODO - #13387: This is component specific, update after implementation
    // it('should prevent new online de-registration request', () => {
    //   const deregisterButtonOnline = wrapper.find('[data-testid="registration-deregister-cta"]');

    //   expect(deregisterButtonOnline.isDisabled()).toStrictEqual(true);
    // });

    // it('should prevent new offline de-registration request', () => {
    //   const deregisterButton = wrapper.find('[data-testid="registration-offline-deregister-cta"]');

    //   expect(deregisterButton.isDisabled()).toStrictEqual(true);
    // });
  });

  // TODO - #13387: Update cases after implementation to identify button outcomes
  // describe('while using the form,', () => {
  //   it.each([
  //     ['registration-online-cta', 'registering-online'],
  //     // ['registration-offline-cta', 'registering-offline'], // TBD file upload
  //     // ['registration-deregister-cta', null], // No de-registering status
  //     // ['registration-offline-deregister-cta', null] // No de-registering status
  //   ])('pressing %p should set status %p', async(ctaId, status) => {
  //     const cta = wrapper.find(`[data-testid="${ ctaId }"]`);

  //     await cta.trigger('click');

  //     expect(wrapper.vm.registrationStatus).toStrictEqual(status);
  //   });
  // });
});
