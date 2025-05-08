package ru.dima.secondseminar.service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.dima.secondseminar.dto.RequestDTO;
import ru.dima.secondseminar.dto.TokenStatsDTO;
import ru.dima.secondseminar.dto.TransactionAnalysisDTO;
import ru.dima.secondseminar.entities.Request;
import ru.dima.secondseminar.entities.User;
import ru.dima.secondseminar.repositories.RequestRepository;
import ru.dima.secondseminar.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Comparator<Request> REQUEST_COMPARATOR = Comparator.comparing(Request::getId);

    private final UserRepository userRepository;

    private final RequestRepository requestRepository;

    public List<RequestDTO> getUserHistory(String telegramId, String walletAddress) {
        validateInput(telegramId, walletAddress);

        User user = findUser(telegramId, walletAddress)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found with telegramId: %s or walletAddress: %s".formatted(telegramId, walletAddress)
                ));

        return mapRequestsToDTOs(user);
    }

    public Optional<User> findUser(String telegramId, String walletAddress) {
        if (telegramId != null && !telegramId.isEmpty()) {
            return userRepository.findByTelegramId(telegramId);
        }
        if (walletAddress != null && !walletAddress.isEmpty()) {
            return userRepository.findByTronWallet(walletAddress);
        }
        return Optional.empty();
    }

    private List<RequestDTO> mapRequestsToDTOs(User user) {
        return user.getRequests().stream()
                   .sorted(REQUEST_COMPARATOR)
                   .map(this::convertToDTO)
                   .toList();
    }

    private RequestDTO convertToDTO(Request request) {
        return new RequestDTO(
                request.getId(),
                request.getHash(),
                request.getAddress(),
                request.getAddressResult(),
                request.getTransactionResult()
        );
    }

    private void validateInput(String telegramId, String walletAddress) {
        if ((telegramId == null || telegramId.isEmpty()) &&
                (walletAddress == null || walletAddress.isEmpty())) {
            throw new IllegalArgumentException("Either telegramId or walletAddress must be provided");
        }
    }

    public void createNewUser(String name, String telegramId, String walletAddress) {
        validateUserInput(name, telegramId, walletAddress);

        if (userRepository.existsByTelegramIdOrTronWallet(telegramId, walletAddress)) {
            throw new IllegalArgumentException("User with this telegramId or wallet already exists");
        }

        User newUser = User.builder()
                           .name(name)
                           .telegramId(telegramId)
                           .tronWallet(walletAddress)
                           .build();

        userRepository.save(newUser);
    }

    public void mergeUser(String name, String telegramId, String walletAddress) {
        validateUserInput(name, telegramId, walletAddress);

        Optional<User> existingUser = userRepository.findByTelegramIdOrTronWallet(telegramId, walletAddress);

        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();

            if (name != null) userToUpdate.setName(name);
            if (telegramId != null && !userToUpdate.getTelegramId().equals(telegramId)) {
                if (userRepository.existsByTelegramId(telegramId)) {
                    throw new IllegalArgumentException("Telegram ID already in use by another user");
                }
                userToUpdate.setTelegramId(telegramId);
            }
            if (walletAddress != null && !userToUpdate.getTronWallet().equals(walletAddress)) {
                if (userRepository.existsByTronWallet(walletAddress)) {
                    throw new IllegalArgumentException("Wallet address already in use by another user");
                }
                userToUpdate.setTronWallet(walletAddress);
            }

            userRepository.save(userToUpdate);
        } else {
            createNewUser(name, telegramId, walletAddress);
        }
    }

    private void validateUserInput(String name, String telegramId, String walletAddress) {
        if ((telegramId == null || telegramId.isEmpty()) &&
                (walletAddress == null || walletAddress.isEmpty())) {
            throw new IllegalArgumentException("Either telegramId or walletAddress must be provided");
        }

        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
    }

    @Transactional
    public void saveUserRequest(Long userId, TokenStatsDTO addressResult, TransactionAnalysisDTO transactionResult) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Optional<Request> existingRequest = requestRepository.findByAddressOrHash(
                addressResult.getContractAddress(),
                transactionResult.getTransactionHash()
        );

        Request request;
        if (existingRequest.isPresent()) {
            request = existingRequest.get();
            request.setAddressResult(addressResult);
            request.setTransactionResult(transactionResult);
        } else {
            request = Request.builder()
                             .hash(transactionResult.getTransactionHash())
                             .address(addressResult.getContractAddress())
                             .addressResult(addressResult)
                             .transactionResult(transactionResult)
                             .build();
        }

        if (user.getRequests().size() >= 20) {
            Request oldestRequest = user.getRequests().stream()
                                        .min(Comparator.comparing(Request::getId))
                                        .orElseThrow();
            user.getRequests().remove(oldestRequest);
        }

        if (!user.getRequests().contains(request)) {
            request = requestRepository.saveAndFlush(request);
            user.getRequests().add(request);
        }

        userRepository.saveAndFlush(user);
    }

    public void deleteUser(String telegramId, String walletAddress) {
        User user = findUser(telegramId, walletAddress)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found with telegramId: %s or walletAddress: %s".formatted(telegramId, walletAddress)
                ));

        this.userRepository.deleteById(user.getId());
    }

    public Long getUserId(String telegramId, String walletAddress) {
        User user = findUser(telegramId, walletAddress)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found with telegramId: %s or walletAddress: %s".formatted(telegramId, walletAddress)
                ));

        return user.getId();
    }
}